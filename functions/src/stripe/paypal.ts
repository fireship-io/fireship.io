import * as functions from 'firebase-functions';
import { assert, getUID, catchErrors } from './helpers';
import { db, lifetimeSKU } from '../config';
import { subscriptionStatus } from './subscriptions';


export const paypalOrderConfirmation = async(uid: string, order: any) => {

    const item = order.purchase_units[0];
    const sku = item.reference_id;

    const isLifetime = sku === lifetimeSKU;

    console.log(order)


    const docData = {
        products: { [sku]: true },
        paypal_payer_id: order.payer.payer_id,
        paypal_email: order.payer.email_address,
        ...(isLifetime ? subscriptionStatus({ id: 'lifetime', status: 'lifetime' }) : null) 
    }

    console.log(docData);

    await db.doc(`users/${uid}`).set(docData, { merge: true });

    return true;

};

export const paypalHandler = functions.https.onCall( async (data, context) => {
    const uid = getUID(context);
    const order = assert(data, 'order');
    return catchErrors(paypalOrderConfirmation(uid, order));
});