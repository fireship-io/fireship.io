---
title: User Profile
description: Fetch and display the current user's data
weight: 24
lastmod: 2024-03-22T10:23:30-09:00
draft: false
vimeo: 927649154
emoji: 🫂
video_length: 3:32
---

### Code

Create a React server component for the login page:

{{< file "react" "app/user/UserProfile.tsx" >}}
```tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import { User } from "@supabase/supabase-js";
import LoginForm from "./LoginForm";

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [stripeCustomer, setStripeCustomer] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      setUser(user);

      if (user) {
        const { data: stripeCustomerData, error } = await supabase
          .from("stripe_customers")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.log("No stripe customer data found",);
        } else {
          setStripeCustomer(stripeCustomerData);
        }
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          if (session) {
            setUser(session.user);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setStripeCustomer(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      <h1>User Data</h1>
      {user ? (
        <>
          <p>
            Signed in with email: <strong>{user.email}</strong>
          </p>
          <p>
            Supabase User ID: <strong>{user.id}</strong>
          </p>
          <div>
          <button className="btn btn-secondary my-3 btn-sm" onClick={handleLogout}>
            Logout
          </button>
          </div>

          <h2>Stripe Customer Data</h2>
          {stripeCustomer ? (<>
            <p>This data lives in the stripe_customers table in Supabase</p>
            <div className="mockup-code">
              <pre>
                <code>{JSON.stringify(stripeCustomer, null, 2)}</code>
              </pre>
            </div>
            </>
          ) : (
            <div>
              <p className="text-yellow-500">
                Stripe customer data not created yet. Buy a plan!
              </p>
            </div>
          )}

        </>
      ) : (
        <>
          <p>No user logged in.</p>
          <LoginForm />
        </>
      )}
      
    </div>
  );
}
```

Update the `app/user/page.tsx` file to include the new `UserProfile` component:

{{< file "react" "app/user/page.tsx" >}}
```tsx
import UserProfile from "./UserProfile";

export default function Login() {
  return (
    <>
      <UserProfile />
    </>
  );
}
```