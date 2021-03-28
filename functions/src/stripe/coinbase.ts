import * as functions from 'firebase-functions';
import { db, lifetimeSKU } from '../config';
import { subscriptionStatus } from './subscriptions';
import { Webhook, Client, resources } from 'coinbase-commerce-node';
import { getUID, assert, catchErrors } from './helpers';

const coinbaseSecret = functions.config().coinbase.secret;
const clientObj = Client.init(coinbaseSecret);
const { Charge } = resources;

export const coinbaseCharge = async (uid: string, product: any) => {
  const chargeData: any = {
    name: product.description,
    description: product.description + ' by Fireship',
    local_price: {
      amount: product.price / 100,
      currency: 'USD',
    },
    pricing_type: 'fixed_price',
    metadata: {
      firebaseUID: uid,
      sku: product.sku,
      productId: product.id
    },
  };
  const charge = await Charge.create(chargeData);

  return charge;
};

export const coinbaseCreateCharge = functions.https.onCall(async (data, context) => {
  const uid = getUID(context);
  const product = assert(data, 'product');
  return catchErrors(coinbaseCharge(uid, product));
});

export const coinbaseWebhookHandler = functions.https.onRequest(async (req, res) => {
  const rawBody: any = req.rawBody;
  const signature: any = req.headers['x-cc-webhook-signature'];
  const sharedSecret = functions.config().coinbase.signing_secret;

  try {
    const event = Webhook.verifyEventBody(rawBody, signature, sharedSecret);
    functions.logger.info('Successfully verified', event);

    const { data } = event;
    const { id, payments } = data as any;
    const { sku, firebaseUID, productId } = (data as any).metadata;

    // const sku = data.description.split('==')[1];
    const isLifetime = sku === lifetimeSKU;

    if (event.type === 'charge:pending') {
      const docData = {
        coinbaseCharges: { [productId]: id },
        products: { [sku]: true },
        ...(isLifetime ? subscriptionStatus({ id: 'lifetime', status: 'lifetime' }) : null),
      };

      await db.doc(`users/${firebaseUID}`).set(docData, { merge: true });
    }

    if (event.type === 'charge:failed' && payments.length) {
        const docData = {
            products: { [sku]: false },
            ...(isLifetime ? { is_pro: false, pro_status: 'canceled'} : null),
          };
    
          await db.doc(`users/${firebaseUID}`).set(docData, { merge: true });
    }

    res.send(`success ${event.id}`);
  } catch (error) {
    functions.logger.error(error);
    res.status(400).send('failure!');
  }
});
