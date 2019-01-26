import * as functions from 'firebase-functions';
import { db, stripeTestKey } from './../config';
import * as Stripe from 'stripe'; 

export const stripe = new Stripe(stripeTestKey);

// Validates UID on callable functions
export const getUID = (context: any) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('permission-denied', 'function called without context.auth');
    } else {
        return context.auth.uid;
    }
}

// Validates UID on callable functions
export const getVal = (data: any, key:string) => {
    if (!data[key]) {
        throw new functions.https.HttpsError('invalid-argument', `function called without ${key} data`);
    } else {
        return data[key];
    }
}

export const attachSource = async(uid: string, sourceId: string) => {

    const customer = await getCustomer(uid);

    const existingSource = customer.sources.data.filter(source => source.id === sourceId).pop() 

    if (existingSource) {
        return existingSource;
    } 
    else {
        return await stripe.customers.createSource(customer.id, { source: sourceId });
    }
}

// Takes a Firebase user and creates a Stripe customer account
export const createCustomer = async(firebaseUser: any) => {
        
    return await stripe.customers.create({
        email: firebaseUser.email,
        metadata: { firebaseUID: firebaseUser.uid }
    })
    
}

export const getCustomer = async(uid: string) => {
    
    const user       = await getUser(uid);
    const customerId = user.stripeCustomerId;

    return await stripe.customers.retrieve(customerId);
}

// Returns the user document data from Firestore
export const getUser = async(uid: string) => {
    return await db.collection('users').doc(uid).get().then(doc => doc.data());
}
