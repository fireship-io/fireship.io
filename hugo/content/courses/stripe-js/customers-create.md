---
title: Create a Customer 
description: Create a Stripe customer record and attach it to a Firebase user. 
weight: 43
lastmod: 2020-04-20T10:23:30-09:00
draft: false
vimeo: 416764441
emoji: 🧑🏿‍🤝‍🧑🏻
video_length: 2:05
---

## Get or Create a Stripe Customer

{{< file "typescript" "customers.ts" >}}
```typescript
/**
 * Gets the exsiting Stripe customer or creates a new record
 */
export async function getOrCreateCustomer(userId: string, params?: Stripe.CustomerCreateParams) {

    const userSnapshot = await db.collection('users').doc(userId).get();

    const { stripeCustomerId, email } = userSnapshot.data();

    // If missing customerID, create it
    if (!stripeCustomerId) {
        // CREATE new customer
        const customer = await stripe.customers.create({
            email,
            metadata: {
                firebaseUID: userId
            },
            ...params
        });
        await userSnapshot.ref.update({ stripeCustomerId: customer.id });
        return customer;
    } else {
        return await stripe.customers.retrieve(stripeCustomerId) as Stripe.Customer;
    }

}
```