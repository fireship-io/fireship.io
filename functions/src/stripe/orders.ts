import * as functions from 'firebase-functions';
import { assert, getUID, catchErrors } from './helpers';
import { db, stripe, lifetimeSKU } from '../config';
import { attachSource } from './sources';
import { subscriptionStatus } from './subscriptions';



export const createOrder = async(uid: string, source: string, sku: string, coupon?: string) => {
    // const customer = await getCustomerId(uid);

    const customer = await attachSource(uid, source);
    const customerId = customer.id;
        
    const data: any = {
        currency: 'usd',
        customer: customerId,
        items: [
            { type: 'sku', parent: sku }
        ]
    }

    // stripe throws err if empty coupon
    if (coupon) data['coupon'] = coupon;
    
    const order = await stripe.orders.create(data);
    
    const paidOrder = await stripe.orders.pay(order.id, { customer: customerId });

    const isLifetime = paidOrder.items.filter(item => item.parent === lifetimeSKU);


    const docData = {
        products: { [sku]: true },
        ...(isLifetime ? subscriptionStatus({ id: 'lifetime', status: 'lifetime' }) : null) 
    }

    

    await db.doc(`users/${uid}`).set(docData, { merge: true });

    return paidOrder;
}



export const stripeCreateOrder = functions.https.onCall( async (data, context) => {
    const uid = getUID(context);
    const source = assert(data, 'source');
    const sku = assert(data, 'sku');
    return catchErrors(createOrder(uid, source.id, sku, data.couponId));
});