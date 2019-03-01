import * as functions from 'firebase-functions';
import { db, stripe, stripeSigningSecret } from '../config';
import { getSubscription, subscriptionStatus } from './subscriptions';


export const webhookHandler = async (hook, data) => {
  const customerId = data.customer;
  const subId = data.subscription; 
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
