import * as functions from 'firebase-functions';
import { assert, getUID, catchErrors } from './helpers';
import { db, stripe, lifetimeSKU, stripeProducts } from '../config';
import { attachSource } from './sources';
import { subscriptionStatus } from './subscriptions';

export const createOrder = async (
  uid: string,
  source: string,
  sku: string,
  amount: number,
) => {

  const customer = await attachSource(uid, source);
  const customerId = customer.id;

  const items = await stripe.invoiceItems.create({
    customer: customerId,
    currency: 'usd',
    amount
  });

  const newInvoice = await stripe.invoices.create({
    auto_advance: false,
    customer: customerId,
    custom_fields: [{ name: 'product', value: sku }]
  });


  try {
    const paidInvoice = await stripe.invoices.pay(newInvoice.id, {
      expand: ['payment_intent']
    });
    if (paidInvoice.paid) {
      const isLifetime = sku === lifetimeSKU;
      const docData = {
        products: { [sku]: true },
        ...(isLifetime
          ? subscriptionStatus({ id: 'lifetime', status: 'lifetime' })
          : null)
      };
      await db.doc(`users/${uid}`).set(docData, { merge: true });
    }

    return paidInvoice;
  } catch (err) {
    const failedInvoice = await stripe.invoices.retrieve(newInvoice.id, {
      expand: ['payment_intent']
    });
    return failedInvoice;
  }
};

export const getCoupon = async (coupon) => {
  try {
    stripe.coupons.retrieve(coupon);
  } catch(error) {
    return undefined;
  }
};

export const validateAmount = async(sku, clientAmount, couponId) => {
  if ( ! ( stripeProducts[sku] && stripeProducts[sku].price ) ) {
    return false;
  }
  const actualAmount = stripeProducts[sku].price;

  let couponResult;
  if ( couponId ) {
    couponResult = await getCoupon(couponId);
  }

  if ( couponResult ) {
    let discountAmount;
    if ( couponResult.percent_off ) {
      discountAmount = actualAmount * (couponResult.percent_off / 100);
    } else if ( couponResult.amount_off ) {
      discountAmount = couponResult.amount_off;
    } else {
      discountAmount = 0;
    }

    const totalAmount = clientAmount + discountAmount;
    if (actualAmount  === totalAmount ) {
      return true;
    } else {
      return false;
    }
  } else {
    if ( actualAmount === clientAmount ) {
      return true;
    } else {
      return false;
    }
  }
};

export const stripeCreateOrder = functions.https.onCall(
  async (data, context) => {
    const uid = getUID(context);
    const source = assert(data, 'source');
    const sku = assert(data, 'sku');
    const amount = assert(data, 'amount');
    const couponId = data['couponId'];
    const isValid = await validateAmount(sku, amount, couponId);
    if ( isValid ) {
      return catchErrors(createOrder(uid, source.id, sku, amount));
    } else {
      throw new functions.https.HttpsError('invalid-argument', 'invalid amount passed for order');
    }
  }
);
