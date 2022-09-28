---
title: React 
description: SignIn with Firebase, then save a credit card to the customer account. 
weight: 47
lastmod: 2020-04-20T10:23:30-09:00
draft: false
vimeo: 416873441
icon: react
video_length: 3:46
---

{{< file "react" "App.js" >}}
```jsx
import React, { useState, useEffect, Suspense } from 'react';
import { fetchFromAPI } from './helpers';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useUser, AuthCheck } from 'reactfire';
import firebase from 'firebase/app';
import { auth, db } from './firebase';


function SaveCard(props) {
  const stripe = useStripe();
  const elements = useElements();
  const user = useUser();

  const [setupIntent, setSetupIntent] = useState();
  const [wallet, setWallet] = useState([]);

  // Get the user's wallet on mount
  useEffect(() => {
    getWallet();
  }, [user]);

  // Create the setup intent
  const createSetupIntent = async (event) => {
    const si = await fetchFromAPI('wallet');
    setSetupIntent(si);
  };

  // Handle the submission of card details
  const handleSubmit = async (event) => {
    event.preventDefault();

    const cardElement = elements.getElement(CardElement);

    // Confirm Card Setup
    const {
      setupIntent: updatedSetupIntent,
      error,
    } = await stripe.confirmCardSetup(setupIntent.client_secret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      alert(error.message);
      console.log(error);
    } else {
      setSetupIntent(updatedSetupIntent);
      await getWallet();
      alert('Success! Card added to your wallet');
    }
  };

  const getWallet = async () => {
    if (user) {
      const paymentMethods = await fetchFromAPI('wallet', { method: 'GET' });
      setWallet(paymentMethods);
    }
  };

  return (
    <>
      <AuthCheck fallback={<SignIn />}>
        <div>

          <button
            onClick={createSetupIntent}
            hidden={setupIntent}>
            Attach New Credit Card
          </button>
        </div>
        <hr />

        <form onSubmit={handleSubmit}>

          <CardElement />
          <button type="submit">
            Attach
          </button>
        </form>

        <div>
          <h3>Retrieve all Payment Sources</h3>
          <select>
            {wallet.map((paymentSource) => (
              <CreditCard key={paymentSource.id} card={paymentSource.card} />
            ))}
          </select>
        </div>
        <div>
          <SignOut user={user} />
        </div>
      </AuthCheck>
    </>
  );
}

function CreditCard(props) {
  const { last4, brand, exp_month, exp_year } = props.card;
  return (
    <option>
      {brand} **** **** **** {last4} expires {exp_month}/{exp_year}
    </option>
  );
}

```