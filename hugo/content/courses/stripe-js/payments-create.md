---
title: Create a Payment Intent
description: How to create a Payment Intent on the Server
weight: 31
lastmod: 2020-04-20T10:23:30-09:00
draft: false
vimeo: 416873167
emoji: 💸
video_length: 1:39
---

## Create a Payment Intent

{{< file "typescript" "payments.ts" >}}
```typescript
import { stripe } from './';

/**
 * Create a Payment Intent with a specific amount
 */
export async function createPaymentIntent(amount: number) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    // receipt_email: 'hello@fireship.io',
  });

  paymentIntent.status

  return paymentIntent;
}

```

## Payments Endpoint


{{< file "typescript" "api.ts" >}}
```typescript
import { createPaymentIntent } from './payments';

/**
 * Payment Intents
 */

app.post(
  '/payments',
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(
      await createPaymentIntent(body.amount)
    );
  })
);

```