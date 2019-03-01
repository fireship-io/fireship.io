---
title: Charges
lastmod: 2019-02-27T09:32:30-07:00
draft: false
description: How to charge a payment source
weight: 17
emoji: 💸
vimeo: 320658551
chapter_start: Charges
---

{{< file "typescript" "charges.ts" >}}
{{< highlight typescript >}}
import * as functions from 'firebase-functions';
import { assert, assertUID, catchErrors } from './helpers';
import { stripe } from './config'; 
import { getCustomer } from './customers';
import { attachSource } from './sources';

/**
Gets a user's charge history
*/
export const getUserCharges = async(uid: string, limit?: number) => {
    const customer = await getCustomer(uid);

    return await stripe.charges.list({ 
        limit, 
        customer 
    });
}

/**
Creates a charge for a specific amount
*/
export const createCharge = async(uid: string, source: string, amount: number, idempotency_key?: string) => {
    const customer = await getCustomer(uid);

    await attachSource(uid, source);
    
    return stripe.charges.create({
            amount,
            customer,
            source,
            currency: 'usd',
        }, 
        
        { idempotency_key }
     )
}


/////// DEPLOYABLE FUNCTIONS ////////

export const stripeCreateCharge = functions.https.onCall( async (data, context) => {
    const uid = assertUID(context);
    const source = assert(data, 'source');
    const amount = assert(data, 'amount');

    // Optional
    const idempotency_key = data.itempotency_key;

    return catchErrors( createCharge(uid, source, amount, idempotency_key) );
});


export const stripeGetCharges = functions.https.onCall( async (data, context) => {
    const uid = assertUID(context);
    return catchErrors( getUserCharges(uid) );
});
{{< /highlight >}}