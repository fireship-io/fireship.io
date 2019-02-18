import { stripe, getSubscription, subscriptionStatus } from './helpers';
import { db, stripeSigningSecret } from '../config';
import * as functions from 'firebase-functions';

export const webhookHandler = async (hook, data) => {
  const customerId = data.customer; //'cus_EXe93qRYYHs65J';
  const subId = data.subscription; //'sub_EY71QNDY8bN3f2'
  const customer = await stripe.customers.retrieve(customerId);
  const uid = customer.metadata.firebaseUID;

  const subscription = await getSubscription(subId);

  // TODO send email on failed payment
  const docData = subscriptionStatus(subscription);

  return await db.doc(`users/${uid}`).set(docData, { merge: true });
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
      const data = event.data.object;
      const hook = event.type;

      await webhookHandler(hook, data);

      res.sendStatus(200);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);
