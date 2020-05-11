---
title: Stripe Webhooks
description: How to work with Stripe webhook events in development
weight: 32
lastmod: 2020-04-20T10:23:30-09:00
draft: false
vimeo: 416872983
emoji: 🎣
video_length: 4:45
---

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) on your local system. 

## Trigger Webhooks Locally

Open a terminal to forward webhooks to the server. 

{{< file "terminal" "command line" >}}
```text
stripe listen --forward-to localhost:3333/hooks
```

Then open another terminal to trigger a mock webhook. 
{{< file "terminal" "command line" >}}
```text
stripe trigger payment_intent.created
```

## Webhook Handler

Update the express middleware to include the body buffer. 

{{< file "typescript" "api.ts" >}}
```typescript
app.use(
  express.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
  })
);
```

{{< file "typescript" "index.ts" >}}
```typescript
import { stripe } from './';
import Stripe from 'stripe';

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
}

/**
 * Validate the stripe webhook secret, then call the handler for the event type
 */
export const handleStripeWebhook = async(req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req['rawBody'], sig, process.env.STRIPE_WEBHOOK_SECRET);
  
  try {
    await webhookHandlers[event.type](event.data.object);
    res.send({received: true});
  } catch (err) {
    console.error(err)
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
```