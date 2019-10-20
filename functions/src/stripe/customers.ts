import * as functions from 'firebase-functions';
import { assert, getUID, catchErrors } from './helpers';
import { db, stripe } from '../config';

/**
 * Takes a Firebase user and creates a Stripe customer account
 */
export const createCustomer = async(firebaseUser: any) => {
    const { uid, email } = firebaseUser;
    const customer = await (stripe.customers as any).create({
        email,
        metadata: { firebaseUID: uid },
    }, 
    { idempotency_key: uid })

    await updateUser(uid, { stripeCustomerId: customer.id })

    return customer;
}
/**
 *  Read the stripe customer ID from firestore, or create a new one if missing
 */
export const getOrCreateCustomer = async(uid: string) => {
    
    const user = await getUser(uid);

    if (!user) {
        await updateUser(uid, { uid });
        return createCustomer({ uid, email: null });
    }


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
 */
export const getUser = async(uid: string) => {
    return await db.collection('users').doc(uid).get().then(doc => doc.data());
}

/**
 *  Convenience method to get customer ID
 */
export const getCustomerId = async(uid: string) => {
    const customer = await getOrCreateCustomer(uid);
    return customer.id;
}


/**
 * Updates the user document non-destructively
 */
export const updateUser = async(uid: string, data: Object) => {
    return await db.collection('users').doc(uid).set(data, { merge: true })
}

/**
 * Get all user charges
 */
export const getUserCharges = async(uid: string, limit?: number) => {
    const customer = await getCustomerId(uid);

    return await stripe.charges.list({ 
        limit, 
        customer 
    });
}

/**
 * Get all invoices
 */
export const getUserInvoices = async(uid: string, limit?: number) => {
    const customer = await getCustomerId(uid);
    return await stripe.invoices.list({ 
        limit, 
        customer
    });
}


export const stripeGetInvoices = functions.https.onCall( async (data, context) => {
    const uid = getUID(context);
    return catchErrors(getUserInvoices(uid));
});




export const stripeGetCharges = functions.https.onCall( async (data, context) => {
    const uid = getUID(context);
    return catchErrors(getUserCharges(uid));
});



export const stripeGetCustomer = functions.https.onCall( async (data, context) => {
    const uid = getUID(context);
    return catchErrors(getOrCreateCustomer(uid));
});
