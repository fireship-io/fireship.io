---
title: Metered Billing
description: Record usage-based billing events
weight: 30
lastmod: 2024-03-22T10:23:30-09:00
draft: false
vimeo: 927648994
emoji: ⏱️
video_length: 5:06
---

### Code


{{< file "react" "app/photos/page.tsx" >}}
```tsx
import DownloadButton from "./DownloadButton";

export default function PhotosPage() {
  const images = [
    'img1.jpg',
    'img2.jpg',
    'img3.jpg',
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="w-full h-48 mb-2 overflow-hidden">
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          <DownloadButton image={image} />
        </div>
      ))}
    </div>
  );
}
```


{{< file "react" "app/photos/DownloadButton.tsx" >}}
```tsx
"use client";

import { supabase } from "@/utils/supabaseClient";
import toast from "react-hot-toast";

export default async function DownloadButton({ image }) {
  const handleDownload = async () => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const res = await fetch("/api/usage-meter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ image }),
    });

    if (res.ok) {
      const { total_downloads } = await res.json();
      toast.success(`Success! You have downloaded ${total_downloads} images`);
    } else {
      const err = await res.json();
      toast.error(`Error! ${err.message}`);
    }
  };

  return (
    <>
      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Download
      </button>
    </>
  );
}
```

{{< file "ts" "app/api/usage-meter/route.tsx" >}}
```typescript
import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe';
import { supabaseAdmin } from '@/utils/supabaseServer';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
    try {

        // Check if the user is logged in
        const token = request.headers.get('Authorization')?.split('Bearer ')[1];
        if (!token) {
            throw 'missing auth token';
        }

        const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

        if (!user || userError) {
            throw 'supabase auth error';
        }

        // Check the user's active_plan status in the stripe_customers table
        const { data: customer, error: fetchError } = await supabaseAdmin
            .from('stripe_customers')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (!customer || !customer.subscription_id || fetchError) {
            throw 'Please subscribe to a plan to download the image.';
        }

        // Create a new record in the downloads table
        const { image } = await request.json();
        await supabaseAdmin
            .from('downloads')
            .insert({ user_id: user.id, image });

        await supabaseAdmin
            .from('stripe_customers')
            .update({ total_downloads: customer.total_downloads + 1})
            .eq('user_id', user.id)

        const subscription = await stripe.subscriptions.retrieve(customer.subscription_id);
        const subscriptionItem = subscription.items.data[0];
        const usageRecord = await stripe.subscriptionItems.createUsageRecord(
            subscriptionItem.id,
            {
                quantity: 1,
                timestamp: 'now',
                action: "increment"
            },
            {
                idempotencyKey: randomBytes(16).toString('hex')
            }
        );


        return NextResponse.json({ message: 'Usage record created successfully!', total_downloads: customer.total_downloads + 1 }, { status: 200 });


    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
```