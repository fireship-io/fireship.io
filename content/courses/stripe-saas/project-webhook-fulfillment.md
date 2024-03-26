---
title: Subscription Fulfillment
description: Fulfill subscription orders with webhooks
weight: 28
lastmod: 2024-03-22T10:23:30-09:00
draft: false
vimeo: 927664473
emoji: 🎁
video_length: 3:41
---


### Commands

```bash
stripe listen -e customer.subscription.updated,customer.subscription.deleted,checkout.session.completed --forward-to http://localhost:3000/api/webhook 
```


### Code


{{< file "react" "app/api/webhook/route.tsx" >}}
```tsx
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe';
import { supabaseAdmin } from '@/utils/supabaseServer';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
    try {
      const rawBody = await request.text();
      const signature = request.headers.get('stripe-signature');
  
      let event;
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature!, process.env.STRIPE_WEBHOOK_SECRET!);
      } catch (error: any) {
        console.error(`Webhook signature verification failed: ${error.message}`);
        return NextResponse.json({ message: 'Webhook Error' }, { status: 400 });
      }
  
      // Handle the checkout.session.completed event
      if (event.type === 'checkout.session.completed') {
        const session: Stripe.Checkout.Session = event.data.object;
        console.log(session);
        const userId = session.metadata?.user_id;

        // Create or update the stripe_customer_id in the stripe_customers table
        const { error } = await supabaseAdmin
        .from('stripe_customers')
        .upsert({ 
            user_id: userId, 
            stripe_customer_id: session.customer, 
            subscription_id: session.subscription, 
            plan_active: true, 
            plan_expires: null 
        })


      }
  
      if (event.type === 'customer.subscription.updated') {

      }
  
      if (event.type === 'customer.subscription.deleted') {

      }
  
      return NextResponse.json({ message: 'success' });
    } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
```