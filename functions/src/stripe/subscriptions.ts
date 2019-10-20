import * as functions from 'firebase-functions';
import { assert, getUID, catchErrors } from './helpers';
import { db, stripe } from '../config';
import { getCustomerId } from './customers';
import { attachSource } from './sources';
import { get } from 'lodash';

export const getSubscription = async (subId: string) => {
  return stripe.subscriptions.retrieve(subId);
};

export const getSubscriptions = async (uid: string) => {
  const customer = await getCustomerId(uid);
  return stripe.subscriptions.list({ customer });
};

export function getCoupon(couponId) {
  return stripe.coupons.retrieve(couponId);
}

export const subscriptionStatus = subscription => {
  return {
    pro_status: subscription.status,
    is_pro: ['active', 'lifetime'].includes(subscription.status),
    subscriptions: {
      [subscription.id]: subscription.status
    }
  };
};

export const createSubscription = async (
  uid: string,
  sourceId: string,
  planId: string,
  couponId?: string
) => {
  const customer = await attachSource(uid, sourceId);
  const customerId = customer.id;

  const subscription = await (stripe.subscriptions as any).create({
    customer: customerId,
    coupon: couponId,
    items: [
      {
        plan: planId
      }
    ],
    expand: ['latest_invoice.payment_intent'],
    payment_behavior: 'allow_incomplete'
  });

  // Add the plan to existing subscriptions
  const docData = subscriptionStatus(subscription);

  await db.doc(`users/${uid}`).set(docData, { merge: true });

  return subscription;
};

export async function cancelSubscription(
  uid: string,
  subId: string
): Promise<any> {
  // const customer = await getCustomer(uid);
  const subscription = await stripe.subscriptions.del(subId);

  const docData = subscriptionStatus(subscription);

  await db.doc(`users/${uid}`).set(docData, { merge: true });

  return subscription;
}

export const stripeCreateSubscription = functions.https.onCall(
  async (data, context) => {
    const uid = getUID(context);
    const source = assert(data, 'source');
    const planId = assert(data, 'planId');
    return catchErrors(
      createSubscription(uid, source.id, planId, data.couponId)
    );
  }
);

export const stripeCancelSubscription = functions.https.onCall(
  async (data, context) => {
    const uid = getUID(context);
    const planId = assert(data, 'planId');
    return catchErrors(cancelSubscription(uid, planId));
  }
);

export const stripeGetSubscriptions = functions.https.onCall(
  async (data, context) => {
    const uid = getUID(context);
    return catchErrors(getSubscriptions(uid));
  }
);

export const stripeGetCoupon = functions.https.onCall(async (data, context) => {
  const couponId = assert(data, 'couponId');
  return catchErrors(getCoupon(couponId));
});
