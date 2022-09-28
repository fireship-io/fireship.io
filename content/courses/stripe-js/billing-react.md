---
title: Billing with React
description: Integrate stripe subscription billing in React
weight: 56
lastmod: 2020-04-28T10:23:30-09:00
draft: false
vimeo: 418656213
icon: react
video_length: 5:58
---

{{< file "react" "Subscriptions.js" >}}
```jsx
import React, { useState, useEffect, Suspense } from 'react';
import { fetchFromAPI } from './helpers';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useUser, AuthCheck } from 'reactfire';

import { db } from './firebase';
import { SignIn, SignOut } from './Customers';

// Shows user document in Firestore
function UserData(props) {

  const [data, setData] = useState({});

  // Subscribe to the user's data in Firestore
  useEffect(
    () => {
      const unsubscribe = db.collection('users').doc(props.user.uid).onSnapshot(doc => setData(doc.data()) )
      return () => unsubscribe()
    },
    [props.user]
  )

  return (
    <pre>
      Stripe Customer ID: {data.stripeCustomerId} <br />
      Subscriptions: {JSON.stringify(data.activePlans || [])}
    </pre>
  );
}

function SubscribeToPlan(props) {
  const stripe = useStripe();
  const elements = useElements();
  const user = useUser();

  const [plan, setPlan] = useState();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get current subscriptions on mount
  useEffect(() => {
    getSubscrptions();
  }, [user]);

  // Fetch current subscriptions from the API
  const getSubscrptions = async () => {
    if (user) {
      const subs = await fetchFromAPI('subscriptions', { method: 'GET' });
      setSubscriptions(subs);
    }
  };

  // Cancel a subscription
  const cancel = async (id) => {
    setLoading(true);
    await fetchFromAPI('subscriptions/' + id, { method: 'PATCH' });
    alert('canceled!');
    await getSubscrptions();
    setLoading(false);
  };

  // Handle the submission of card details
  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    const cardElement = elements.getElement(CardElement);

    // Create Payment Method
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // Create Subscription on the Server
    const subscription = await fetchFromAPI('subscriptions', {
      body: {
        plan,
        payment_method: paymentMethod.id,
      },
    });

    // The subscription contains an invoice
    // If the invoice's payment succeeded then you're good, 
    // otherwise, the payment intent must be confirmed

    const { latest_invoice } = subscription;

    if (latest_invoice.payment_intent) {
      const { client_secret, status } = latest_invoice.payment_intent;

      if (status === 'requires_action') {
        const { error: confirmationError } = await stripe.confirmCardPayment(
          client_secret
        );
        if (confirmationError) {
          console.error(confirmationError);
          alert('unable to confirm card');
          return;
        }
      }

      // success
      alert('You are subscribed!');
      getSubscrptions();
    }

    setLoading(false);
    setPlan(null);
  };

  return (
    <>
      <AuthCheck fallback={<SignIn />}>
        <div>
          {user?.uid && <UserData user={user} />}
        </div>

        <hr />

        <div>

          <button
            onClick={() => setPlan('plan_HC2o83JbeowZnP')}>
            Choose Monthly $25/m
          </button>

          <button
            onClick={() => setPlan('plan_HD6rlaovzAiM7B')}>
            Choose Quarterly $50/q
          </button>

          <p>
            Selected Plan: <strong>{plan}</strong>
          </p>
        </div>
        <hr />

        <form onSubmit={handleSubmit} hidden={!plan}>

          <CardElement />
          <button type="submit" disabled={loading}>
            Subscribe & Pay
          </button>
        </form>

        <div>
          <h3>Manage Current Subscriptions</h3>
          <div>
            {subscriptions.map((sub) => (
              <div key={sub.id}>
                {sub.id}. Next payment of {sub.plan.amount} due{' '}
                {new Date(sub.current_period_end * 1000).toUTCString()}
                <button
                  onClick={() => cancel(sub.id)}
                  disabled={loading}>
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SignOut user={user} />
        </div>
      </AuthCheck>
    </>
  );
}

export default function Subscriptions() {
  return (
    <Suspense fallback={'loading user'}>
      <SubscribeToPlan />
    </Suspense>
  );
}

```