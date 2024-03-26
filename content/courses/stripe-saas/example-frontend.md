---
title: Checkout Frontend
description: Trigger a Stripe Checkout Session from a web frontend
weight: 13
lastmod: 2024-03-22T10:23:30-09:00
draft: false
vimeo: 927619796
emoji: 💻
video_length: 1:33
---


### Prompt Template

```text
Create a GET endpoint on the "/" route in [SOME WEB FRAMEWORK] that renders an HTML page.
The webpage should contain a button that triggers a POST request to the /checkout endpoint using the browser fetch API. 
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

app.get('/', (c) => {
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Checkout</title>
      <script src="https://js.stripe.com/v3/"></script>
    </head>
    <body>
      <h1>Checkout</h1>
      <button id="checkoutButton">Checkout</button>

      <script>
        const checkoutButton = document.getElementById('checkoutButton');
        checkoutButton.addEventListener('click', async () => {
          const response = await fetch('/checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const { id } = await response.json();
          const stripe = Stripe('${process.env.STRIPE_PUBLISHABLE_KEY}');
          await stripe.redirectToCheckout({ sessionId: id });
        });
      </script>
    </body>
  </html>
`;
  return c.html(html);
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
```

