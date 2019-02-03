import * as functions from 'firebase-functions';
import { db, stripeTestKey } from './../config';
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
        return await stripe.customers.createSource(customer.id, { source: sourceId });
    }
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
const getOrCreateCustomer = async(uid: string) => {
    
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