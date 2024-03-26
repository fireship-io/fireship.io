---
title: Billing Portal
description: Manage subscription cancellations in the Stripe portal
weight: 29
lastmod: 2024-03-22T10:23:30-09:00
draft: false
vimeo: 927649081
emoji: 🍞
video_length: 4:12
---

### Code


{{< file "ts" "app/portal/portalAction.ts" >}}
```typescript
'use server';

import { stripe } from "@/utils/stripe";


export async function createPortalSession(customerId: string) {
    const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `http://localhost:3000`,
      });
  
      return { id: portalSession.id, url: portalSession.url };
}
```


{{< file "react" "app/portal/PortalButton.tsx" >}}
```tsx
'use client';

import { createPortalSession } from './portalAction';
import { supabase } from '@/utils/supabaseClient';
import toast from 'react-hot-toast';

export default function PortalButton() {
  const handleClick = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw 'Please log in to manage your billing.';
      }

      const { data: customer, error: fetchError } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();
    
      const { url } = await createPortalSession(customer?.stripe_customer_id);

      window.location.href = url;

    } catch (error) {
      console.error(error);
      toast.error('Failed to create billing portal session:');
    }
  }

  return (
    <>
      <button className="btn btn-primary btn-outline my-3" onClick={handleClick}>
        Manage Billing
      </button>
    </>
  );
}
```

{{< file "ts" "app/api/webhook/route.tsx" >}}
```typescript

  //... omitted webhook signature verification

    if (event.type === 'customer.subscription.updated') {

        const subscription: Stripe.Subscription = event.data.object;
        console.log(subscription);
            // Update the plan_expires field in the stripe_customers table
        const { error } = await supabaseAdmin
            .from('stripe_customers')
            .update({ plan_expires: subscription.cancel_at })
            .eq('subscription_id', subscription.id);

    }

    if (event.type === 'customer.subscription.deleted') {

        const subscription = event.data.object;
        console.log(subscription);

        const { error } = await supabaseAdmin
        .from('stripe_customers')
        .update({ plan_active: false, subscription_id: null })
        .eq('subscription_id', subscription.id);

    }
```