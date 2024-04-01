---
title: Environment Variables 
description: Add the Stripe SDK to Environment Variables
weight: 11
lastmod: 2024-03-22T10:23:30-09:00
draft: false
vimeo: 927619770
emoji: 🔐
video_length: 3:01
---

### Commands

Create a .env file and install the dotenv and stripe packages.

```bash
touch .env
npm i dotenv stripe
```

### Prompt Template

```text
Configure Stripe environemt variables in [SOME WEB FRAMEWORK] using the code below as a reference. 
Use the environment variables to initialize the Stripe SDK.
```

### Code

{{< file "cog" ".env" >}}
```text
STRIPE_PUBLISHABLE_KEY=pk_test_
STRIPE_SECRET_KEY=sk_test_
STRIPE_WEBHOOK_SECRET=whsec_
```

{{< file "ts" "src/index.ts" >}}
```typescript
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import Stripe from 'stripe';
import 'dotenv/config'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


const app = new Hono()

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
```

