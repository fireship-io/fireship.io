---
title: Checkout Session
description: Create a Stripe Checkout Session on the server
weight: 12
lastmod: 2024-03-22T10:23:30-09:00
draft: false
vimeo: 927619746
emoji: 🛒
video_length: 2:31
---

### Extra Resources

- Stripe Testing Cards [Link](https://docs.stripe.com/testing)

### Prompt Template

```text
Create a POST endpoint in [SOME WEB FRAMEWORK] that creates a Stripe Checkout Session using the code below as a reference. 
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

app.get('/success', (c) => {
  return c.text('Success!')
})

app.get('/cancel', (c) => {
  return c.text('Hello Hono!')
})


app.post('/checkout', async (c) => {
  

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_YOUR_PRICE_ID',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000//cancel',
    });

    return c.json(session);
  } catch (error: any) {
    console.error(error);
    throw new HTTPException(500, { message: error?.message });
  }
});

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
```

