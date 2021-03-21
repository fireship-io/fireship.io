import * as functions from 'firebase-functions';
import { db, lifetimeSKU } from '../config';
import { subscriptionStatus } from './subscriptions';
import { Webhook } from 'coinbase-commerce-node';


export const coinbaseWebhookHandler = functions.https.onRequest(
    async (req, res) => {

        const rawBody = req.rawBody;
        const signature = req.headers['x-cc-webhook-signature'];
        const sharedSecret = functions.config().coinbase.signing_secret;
 
        try {
            const event = Webhook.verifyEventBody(rawBody, signature, sharedSecret);
            functions.logger.info('Successfully verified', event);

            const { data } = event;

            const sku = data.description.split('==')[1];
            const isLifetime = sku === lifetimeSKU;
        
              const docData = {
                products: { [sku]: true },
                ...(isLifetime
                  ? subscriptionStatus({ id: 'lifetime', status: 'lifetime' })
                  : null)
                }
              
                await db.doc(`users/${uid}`).set(docData, { merge: true });

            if (event.type === 'charge:created') {

            }

            if (event.type === 'charge:failed') {

            }


            res.send(`success ${event.id}`);

        } catch(error) {
            functions.logger.error(error);
            res.status(400).send('failure!');
        }
    }
);
