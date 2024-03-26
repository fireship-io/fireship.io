---
title: Start a Subscription
description: Create a Stripe subscription endpoint
weight: 26
lastmod: 2024-03-22T10:23:30-09:00
draft: false
vimeo: 927648971
emoji: 💫
video_length: 3:36
---

### Code


{{< file "ts" "utils/stripe.ts" >}}
```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
```

{{< file "ts" "app/api/checkout/route.ts" >}}
```tsx
import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe';

export async function POST(request: Request) {
    try {
        const { priceId, email, userId } = await request.json();

        const session = await stripe.checkout.sessions.create({
            metadata: {
                user_id: userId,
            },
            customer_email: email,
            payment_method_types: ['card'],
            line_items: [
                {
                    // base subscription
                    price: priceId,
                },
                {
                    // one-time setup fee
                    price: 'price_1OtHdOBF7AptWZlcPmLotZgW',
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${request.headers.get('origin')}/success`,
            cancel_url: `${request.headers.get('origin')}/cancel`,
        });

        return NextResponse.json({ id: session.id });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
```

{{< file "react" "app/CheckoutButton.tsx" >}}
```tsx
'use client';

import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../utils/supabaseClient';
import toast from 'react-hot-toast';


export default function CheckoutButton() {
  const handleCheckout = async() => {
    const { data } = await supabase.auth.getUser();

    if (!data?.user) {
      toast.error("Please log in to create a new Stripe Checkout session");
      return;
    }

    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    const stripe = await stripePromise;
    const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: 'price_1OtHkdBF7AptWZlcIjbBpS8r', userId: data.user?.id, email: data.user?.email }),
      });
    const session = await response.json();
    await stripe?.redirectToCheckout({ sessionId: session.id });
  }

  return (
    <div>
      <h1>Signup for a Plan</h1>
      <p>Clicking this button creates a new Stripe Checkout session</p>
      <button className="btn btn-accent" onClick={handleCheckout}>Buy Now</button>
    </div>
  );
}
```