import * as functions from 'firebase-functions';
import { 
    attachSource,
    getUID, 
    assert, 
    catchErrors,
    getOrCreateCustomer,
    getUserCharges, 
    createSubscription,
    getUserInvoices,
    cancelSubscription,
    getSubscriptions,
    getCoupon,
    createOrder
} from './helpers';



export const stripeSetSource = functions.https.onCall( async (data, context) => {
    const uid = getUID(context);
    const source = assert(data, 'source');

    return catchErrors(attachSource(uid, source.id));
});

export const stripeCreateCharge = functions.https.onCall( async (data, context) => {
    // const uid = getUID(context);
    // const source = getVal(data, 'source');
    // return await attachSource(uid, source.id);
});

export const stripeCreateOrder = functions.https.onCall( async (data, context) => {
    const uid = getUID(context);
    const source = assert(data, 'source');
    const sku = assert(data, 'sku');
    return catchErrors(createOrder(uid, source.id, sku, data.couponId));
});


export const stripeCreateSubscription = functions.https.onCall( async (data, context) => {
    const uid = getUID(context);
    const source = assert(data, 'source');
    const planId = assert(data, 'planId');
    return createSubscription(uid, source.id, planId, data.couponId);
});

export const stripeCancelSubscription = functions.https.onCall( async (data, context) => {
    const uid = getUID(context);
    const planId = assert(data, 'planId');
    return cancelSubscription(uid, planId);
});


export const stripeGetCharges = functions.https.onCall( async (data, context) => {
    const uid = getUID(context);
    return getUserCharges(uid);
});

export const stripeGetInvoices = functions.https.onCall( async (data, context) => {
    const uid = getUID(context);
    return getUserInvoices(uid);
});

export const stripeGetSubscriptions = functions.https.onCall( async (data, context) => {
    const uid = getUID(context);
    return getSubscriptions(uid);
});



export const stripeGetCustomer = functions.https.onCall( async (data, context) => {
    const uid = getUID(context);
    return getOrCreateCustomer(uid);
});

export const stripeGetCoupon= functions.https.onCall( async (data, context) => {
    const couponId = assert(data, 'couponId');
    return getCoupon(couponId);
});
  