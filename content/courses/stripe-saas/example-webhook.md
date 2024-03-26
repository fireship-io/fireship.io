---
title: Webhooks
description: Create a secure webhook handler endpoint
weight: 15
lastmod: 2024-03-22T10:23:30-09:00
draft: false
vimeo: 927619867
emoji: 🎣
video_length: 3:14
---


### Prompt Template

```text
Create a POST endpoint on the "/webhook" route in [SOME WEB FRAMEWORK] to handle Stripe webhook events.
The handler should verify the webhook signature and handle the "checkout.session.completed" event.
Use the code below as a reference:
```

### Code

{{< file "ts" "src/index.ts" >}}
```typescript
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception';
import Stripe from 'stripe';
import 'dotenv/config'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


const app = new Hono()

app.post('/webhook', async (c) => {
  const rawBody = await c.req.text();
  const signature = c.req.header('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    throw new HTTPException(400)
  } 

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log(session)

    // TODO Fulfill the purchase with your own business logic, for example:
    // Update Database with order details
    // Add credits to customer account
    // Send confirmation email
    // Print shipping label
    // Trigger order fulfillment workflow
    // Update inventory
    // Etc.
  }

  return c.text('success');
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
```

