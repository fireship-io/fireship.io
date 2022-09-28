---
title: Create a Subscription 
description: Add a customer to a paid subscription plan
weight: 51
lastmod: 2020-04-20T10:23:30-09:00
draft: false
vimeo: 416888571
emoji: 🔄
video_length: 3:12
---

## Webhooks

NOTE. I also highly recommend listening to the `customer.subscription.created` to update Firestore when a new subscription is created and/or `customer.subscription.deleted` for cancellations. See the full source code for implementation examples. 

## Create a Subscription for Existing Customer

{{< file "ts" "billing.ts" >}}
```typescript
import { stripe } from './';
import { db } from './firebase';
import Stripe from 'stripe';
import { getOrCreateCustomer } from './customers';
import { firestore } from 'firebase-admin';

/**
 * Attaches a payment method to the Stripe customer,
 * subscribes to a Stripe plan, and saves the plan to Firestore
 */
export async function createSubscription(
  userId: string,
  plan: string,
  payment_method: string
) {
  const customer = await getOrCreateCustomer(userId);

  // Attach the  payment method to the customer
  await stripe.paymentMethods.attach(payment_method, { customer: customer.id });

  // Set it as the default payment method
  await stripe.customers.update(customer.id, {
    invoice_settings: { default_payment_method: payment_method },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan }],
    expand: ['latest_invoice.payment_intent'],
  });


  const invoice = subscription.latest_invoice as Stripe.Invoice;
  const payment_intent = invoice.payment_intent as Stripe.PaymentIntent;

  // Update the user's status
  if (payment_intent.status === 'succeeded') {
    await db
      .collection('users')
      .doc(userId)
      .set(
        {
          stripeCustomerId: customer.id,
          activePlans: firestore.FieldValue.arrayUnion(plan),
        },
        { merge: true }
      );
  }

  return subscription;
}


```

## API Endpoint 

{{< file "ts" "api.ts" >}}
```typescript
app.post(
  '/subscriptions/',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const { plan, payment_method } = req.body;
    const subscription = await createSubscription(user.uid, plan, payment_method);
    res.send(subscription);
  })
);

```