import * as functions from 'firebase-functions';
import { db, stripe, stripeSigningSecret, lifetimeSKU } from '../config';
import { getSubscription, subscriptionStatus } from './subscriptions';

export const webhookHandler = async (invoice: any, hook: any) => {
  const customerId = invoice.customer;
  const subId = invoice.subscription;
  const customer = await stripe.customers.retrieve(customerId);
  const uid = customer.metadata.firebaseUID;


  if (subId) {
    // Subscription
    const subscription = await getSubscription(subId);
    const docData = subscriptionStatus(subscription);
    await db.doc(`users/${uid}`).set(docData, { merge: true });
  } else {
    // Single product purchase
    const sku = invoice.custom_fields.find(v => v.name === 'product').value;
    const isLifetime = sku === lifetimeSKU;

    if (invoice.paid) {
      const docData = {
        products: { [sku]: true },
        ...(isLifetime
          ? subscriptionStatus({ id: 'lifetime', status: 'lifetime' })
          : null)
      };
      await db.doc(`users/${uid}`).set(docData, { merge: true });
    }

  }
  return null;
};

export const stripeWebhookHandler = functions.https.onRequest(
  async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'];
      const event = stripe.webhooks.constructEvent(
        (req as any).rawBody,
        sig,
        stripeSigningSecret
      );
      const invoice = event.data.object;
      const hook = event.type;

      await webhookHandler(invoice, hook);

      res.sendStatus(200);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);
