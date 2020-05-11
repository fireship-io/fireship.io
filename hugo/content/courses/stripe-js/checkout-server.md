---
title: Stripe Checkout on the Server
description: Create a checkout session on the server
weight: 21
lastmod: 2020-04-20T10:23:30-09:00
draft: false
vimeo: 416760824
emoji: 🛒
video_length: 3:39
---

## Stripe Checkout on the Server

{{< file "typescript" "checkout.ts" >}}
```typescript
import { stripe } from './';
import Stripe from 'stripe';

/**
 * Creates a Stripe Checkout session with line items
 */
export async function createStripeCheckoutSession(
  line_items: Stripe.Checkout.SessionCreateParams.LineItem[]
) {

  const url = 'http://localhost:3000'; //process.env.WEBAPP_URL;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${url}/failed`,
  });

  return session;
}

```

## API Endpoint

{{< file "typescript" "api.ts" >}}
```typescript
/**
 * Catch async errors when awaiting promises 
 */
function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
}

/**
 * Checkouts
 */
app.post(
  '/checkouts/',
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(await createStripeCheckoutSession(body.line_items));
  })
);

```

