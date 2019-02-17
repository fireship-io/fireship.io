import * as functions from 'firebase-functions';
import { db, stripeTestKey, stripeSigningSecret } from './../config';
import { pick } from 'lodash';
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
export const getVal = (data: any, key:string) => {
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
    return getVal(user, 'stripeCustomerId');
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
    const user       = await getUser(uid);
    const customerId = getVal(user, 'stripeCustomerId');

    return await stripe.charges.list({ 
        limit, 
        customer: customerId 
    });
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

export const createSubscription = async(userId:string, sourceId:string, planId: string) => {

 
    const user       = await getUser(userId);
    const customer   = user.stripeCustomerId;

    const card       = await attachSource(userId, sourceId)

    // validate plan does not already exist
    // const activeSubscription = await getSubscription(customer, planId);
    // console.log(222, activeSubscription)
    // if (activeSubscription) {
    //     throw new functions.https.HttpsError('permission-denied', 'this account already has an active subscription');
    // };

    const subscription = await stripe.subscriptions.create({
        customer: customer,
        items: [
            {
              plan: planId,
            },
        ],
    });

    // Add the plan to existing subscriptions
    const data = {
        pro_status: 'active',
        is_pro: true,
        subscriptions: {
            [subscription.id]: subscription.status
        }
    };

    await db.doc(`users/${userId}`).set(data, { merge: true });

    return subscription;
}

export async function cancelSubscription(uid: string, subId: string): Promise<any> {
    const user = await getUser(uid);
    const customer   = user.stripeCustomerId;

    
    const subscription  = await stripe.subscriptions.del(subId);

    const data = {
        pro_status: 'retired',
        is_pro: false,
        subscriptions: {
            [subId]: subscription.status
        }
    };


    await db.doc(`users/${uid}`).set(data, { merge: true });

    return subscription;
}


export function verifyWebhook(req) {
    return (req.headers['stripe-signature'] === stripeSigningSecret);
}


// export const filterSubscriptionData = (sub: Stripe.subscriptions.ISubscription) => {
//     const base = pick(sub, ['id', 'status', 'days_until_due', 'created'])
//     return { ...base, }
// }