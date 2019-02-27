import * as functions from 'firebase-functions';
import { db, stripeTestKey, lifetimeSKU } from './../config';
import * as Stripe from 'stripe'; 

export const stripe = new Stripe(stripeTestKey);

export const catchErrors = async (promise: Promise<any>) => {
    try {
        return await promise;
    } catch(err) {
        throw new functions.https.HttpsError('unknown', err)
    }
}


// Validates UID on callable functions
export const getUID = (context: any) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('permission-denied', 'function called without context.auth');
    } else {
        return context.auth.uid;
    }
}

// Validates data payload on callable functions
export const assert = (data: any, key:string) => {
    if (!data[key]) {
        throw new functions.https.HttpsError('invalid-argument', `function called without ${key} data`);
    } else {
        return data[key];
    }
}
/**
 * Attaches a payment source to a stripe customer account.
 *
 * @param {string} uid
 * @param {string} sourceId
 * @returns stripe source
 */
export const attachSource = async(uid: string, sourceId: string) => {

    const customer = await getOrCreateCustomer(uid);

    const existingSource = customer.sources.data.filter(source => source.id === sourceId).pop() 

    if (existingSource) {
        return existingSource;
    } 
    else {
        await stripe.customers.createSource(customer.id, { source: sourceId });
        // update default
        return await stripe.customers.update(customer.id, { default_source: sourceId });
    }
}

export const detachSource = async(uid: string, sourceId: string) => {
    const customer = await getOrCreateCustomer(uid);
    return await stripe.customers.deleteSource(customer.id, sourceId);
}

/**
 * Takes a Firebase user and creates a Stripe customer account
 *
 * @param {*} firebaseUser
 * @returns stripe customer
 */
const createCustomer = async(firebaseUser: any) => {
    const { uid, email } = firebaseUser;
    const customer = await stripe.customers.create({
        email,
        metadata: { firebaseUID: uid }
    })

    await updateUser(uid, { stripeCustomerId: customer.id })

    return customer;
}
/**
 *  Read the stripe customer ID from firestore, or create a new one if missing
 *
 * @param {string} uid
 * @returns stripe customer
 */
export const getOrCreateCustomer = async(uid: string) => {
    
    const user       = await getUser(uid);
    const customerId = user.stripeCustomerId;

    // If missing customerID, create it
    if (!customerId) {
        return createCustomer(user);
    } else {
        return stripe.customers.retrieve(customerId);
    }

}


/**
 *  Use this function to read the user document from Firestore
 *
 * @param {string} uid
 * @returns firebase user
 */
const getUser = async(uid: string) => {
    return await db.collection('users').doc(uid).get().then(doc => doc.data());
}

export const getCustomer = async(uid: string) => {
    const user       = await getUser(uid);
    return assert(user, 'stripeCustomerId');
}


/**
 * Updates the user document non-destructively
 *
 * @param {string} uid
 * @param {Object} data
 * @returns void
 */
const updateUser = async(uid: string, data: Object) => {
    return await db.collection('users').doc(uid).set(data, { merge: true })
}

export const getUserCharges = async(uid: string, limit?: number) => {
    const customer = await getCustomer(uid);

    return await stripe.charges.list({ 
        limit, 
        customer 
    });
}

export const createCharge = async(uid: string, source: string, amount: number) => {
    const customer = await getCustomer(uid);

    const card = await attachSource(uid, source);
    
    return stripe.charges.create({
        amount,
        customer,
        source,
        currency: 'usd',
    })
}

export const createOrder = async(uid: string, source: string, sku: string, coupon?: string) => {
    const customer = await getCustomer(uid);

    const card = await attachSource(uid, source);
        
    const data: any = {
        currency: 'usd',
        customer,
        items: [
            { type: 'sku', parent: sku }
        ]
    }

    // stripe throws err if empty coupon
    if (coupon) data['coupon'] = coupon;
    
    const order = await stripe.orders.create(data);
    
    const paidOrder = await stripe.orders.pay(order.id, { customer });

    const isLifetime = paidOrder.items.filter(item => item.parent === lifetimeSKU);


    const docData = {
        products: { [sku]: true },
        ...(isLifetime ? subscriptionStatus({ id: 'lifetime', status: 'lifetime' }) : null) 
    }

    

    await db.doc(`users/${uid}`).set(docData, { merge: true });

    return paidOrder;
}

export const getUserInvoices = async(uid: string, limit?: number) => {
    const customer = await getCustomer(uid);
    return await stripe.invoices.list({ 
        limit, 
        customer
    });
}


export const getSubscription = async(subId: string) => {
    return stripe.subscriptions.retrieve(subId);
}

export const getSubscriptions = async(uid: string) => {
    const customer = await getCustomer(uid);
    return stripe.subscriptions.list({ customer });
}

export const createSubscription = async(uid:string, sourceId:string, planId: string, couponId?: string) => {

 
    const customer = await getCustomer(uid);
    const card       = await attachSource(uid, sourceId);

    const subscription = await stripe.subscriptions.create({
        customer: customer,
        coupon: couponId,
        items: [
            {
              plan: planId,
            },
        ],
    });

    // Add the plan to existing subscriptions
    const docData = subscriptionStatus(subscription);

    await db.doc(`users/${uid}`).set(docData, { merge: true });

    return subscription;
}

export async function cancelSubscription(uid: string, subId: string): Promise<any> {
    const user = await getUser(uid);
    const customer   = user.stripeCustomerId;
    const subscription  = await stripe.subscriptions.del(subId);

    const docData = subscriptionStatus(subscription);

    await db.doc(`users/${uid}`).set(docData, { merge: true });

    return subscription;
}

export function getCoupon(couponId) {
    return stripe.coupons.retrieve(couponId);
}



export const subscriptionStatus = (subscription) => {
    return {
        pro_status: subscription.status,
        is_pro: ['active', 'lifetime'].includes(subscription.status),
        subscriptions: {
            [subscription.id]: subscription.status
        }
    }
}