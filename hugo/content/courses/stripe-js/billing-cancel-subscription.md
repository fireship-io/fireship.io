---
title: Cancel a Subscription 
description: Cancel a subscription
weight: 52
lastmod: 2020-04-20T10:23:30-09:00
draft: false
vimeo: 416888757
emoji: 🔄
video_length: 2:21
---

## List and Cancel Subscriptions

{{< file "typescript" "index.ts" >}}
```typescript
/**
 * Cancels an active subscription, syncs the data in Firestore
 */
export async function cancelSubscription(
  userId: string,
  subscriptionId: string
) {
  const customer = await getOrCreateCustomer(userId);
  if (customer.metadata.firebaseUID !== userId) {
    throw Error('Firebase UID does not match Stripe Customer');
  }
  const subscription = await stripe.subscriptions.del(subscriptionId);

  // Cancel at end of period
  // const subscription = stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });

  if (subscription.status === 'canceled') {
    await db
      .collection('users')
      .doc(userId)
      .update({
        activePlans: firestore.FieldValue.arrayRemove(subscription.plan.id),
      });
  }

  return subscription;
}

/**
 * Returns all the subscriptions linked to a Firebase userID in Stripe
 */
export async function listSubscriptions(userId: string) {
  const customer = await getOrCreateCustomer(userId);
  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
  });

  return subscriptions;
};
```

## API Endpoints 

{{< file "typescript" "api.ts" >}}
```typescript
// Get all subscriptions for a customer
app.get(
  '/subscriptions/',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);

    const subscriptions = await listSubscriptions(user.uid);

    res.send(subscriptions.data);
  })
);

// Unsubscribe or cancel a subscription
app.patch(
  '/subscriptions/:id',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    res.send(await cancelSubscription(user.uid, req.params.id));
  })
);

```