---
title: Save and List Card
description: Save a card for future payments & list all available cards
weight: 44
lastmod: 2020-04-20T10:23:30-09:00
draft: false
vimeo: 416764509
emoji: 🧑🏿‍🤝‍🧑🏻
video_length: 2:08
---

## Save and List Credit Cards

{{< file "typescript" "customers.ts" >}}
```typescript
/**
 * Creates a SetupIntent used to save a credit card for later use
 */
export async function createSetupIntent(userId: string) {

    const customer = await getOrCreateCustomer(userId);

    return stripe.setupIntents.create({ 
        customer: customer.id,
    })
}

/**
 * Returns all payment sources associated to the user
 */
export async function listPaymentMethods(userId: string) {
    const customer = await getOrCreateCustomer(userId);

    return stripe.paymentMethods.list({
        customer: customer.id,
        type: 'card',
    });
}

```

## API Endpoints

{{< file "typescript" "api.ts" >}}
```typescript
/**
 * Customers and Setup Intents
 */

// Save a card on the customer record with a SetupIntent
app.post(
  '/wallet',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const setupIntent = await createSetupIntent(user.uid);
    res.send(setupIntent);
  })
);

// Retrieve all cards attached to a customer
app.get(
  '/wallet',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);

    const wallet = await listPaymentMethods(user.uid);
    res.send(wallet.data);
  })
);
```