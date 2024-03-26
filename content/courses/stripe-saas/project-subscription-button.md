---
title: Checkout Redirect
description: Redirect to a Checkout Session
weight: 27
lastmod: 2024-03-22T10:23:30-09:00
draft: false
vimeo: 927648940
emoji: 🎞️
video_length: 2:09
---


{{< file "react" "app/CheckoutButton.tsx" >}}
```tsx
'use client';

import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/utils/supabaseClient';
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