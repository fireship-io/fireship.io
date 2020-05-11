---
title: Recurring Payments
description: Webhooks to handle recurring subscription payments and cancelations
weight: 53
lastmod: 2020-04-28T10:23:30-09:00
draft: false
vimeo: 416888865
emoji: 🔄
video_length: 3:02
---

## Subscription Billing Webhook Examples

{{< file "typescript" "billing.ts" >}}
```typescript
import { stripe } from './';
import Stripe from 'stripe';
import { db } from './firebase';
import { firestore } from 'firebase-admin';

/**
 * Business logic for specific webhook event types
 */
const webhookHandlers = {
    'payment_intent.succeeded': async (data: Stripe.PaymentIntent) => {
      // Add your business logic here
    },
    'payment_intent.payment_failed': async (data: Stripe.PaymentIntent) => {
      // Add your business logic here
    },
    'customer.subscription.deleted': async (data: Stripe.Subscription) => {
      const customer = await stripe.customers.retrieve( data.customer as string ) as Stripe.Customer;
      const userId = customer.metadata.firebaseUID;
      const userRef = db.collection('users').doc(userId);

        await userRef
          .update({
            activePlans: firestore.FieldValue.arrayRemove(data.plan.id),
          });
    },
    'customer.subscription.created': async (data: Stripe.Subscription) => {
      const customer = await stripe.customers.retrieve( data.customer as string ) as Stripe.Customer;
      const userId = customer.metadata.firebaseUID;
      const userRef = db.collection('users').doc(userId);

        await userRef
          .update({
            activePlans: firestore.FieldValue.arrayUnion(data.plan.id),
          });
    },
    'invoice.payment_succeeded': async (data: Stripe.Invoice) => {
      // Add your business logic here
    },
    'invoice.payment_failed': async (data: Stripe.Invoice) => {
      
      const customer = await stripe.customers.retrieve( data.customer as string ) as Stripe.Customer;
      const userSnapshot = await db.collection('users').doc(customer.metadata.firebaseUID).get();
      await userSnapshot.ref.update({ status: 'PAST_DUE' });

    }
}
```