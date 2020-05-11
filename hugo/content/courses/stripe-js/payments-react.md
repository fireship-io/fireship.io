---
title: React 
description: React integration of Payment Intents API & Stripe Elements
weight: 35
lastmod: 2020-04-20T10:23:30-09:00
draft: false
vimeo: 416872828
icon: react
video_length: 4:26
---

## React Payments UI

{{< file "react" "Payments.js" >}}
```jsx
import React, { useState } from 'react';
import { fetchFromAPI } from './helpers';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function Payments() {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState(0);
  const [paymentIntent, setPaymentIntent] = useState();

  // Create a payment intent on the server
  const createPaymentIntent = async (event) => {

    // Clamp amount to Stripe min/max
    const validAmonut = Math.min(Math.max(amount, 50), 9999999);
    setAmount(validAmonut);

    // Make the API Request
    const pi = await fetchFromAPI('payments', { body: { amount: validAmonut } });
    setPaymentIntent(pi);
  };

  // Handle the submission of card details
  const handleSubmit = async (event) => {
    event.preventDefault();

    const cardElement = elements.getElement(CardElement);

    // Confirm Card Payment
    const {
      paymentIntent: updatedPaymentIntent,
      error,
    } = await stripe.confirmCardPayment(paymentIntent.client_secret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      console.error(error);
      error.payment_intent && setPaymentIntent(error.payment_intent);
    } else {
      setPaymentIntent(updatedPaymentIntent);
    }
  };

  return (
    <>

      <div>
        <input
          type="number"
          value={amount}
          disabled={paymentIntent}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          disabled={amount <= 0}
          onClick={createPaymentIntent}
          hidden={paymentIntent}>
          Ready to Pay ${ (amount / 100).toFixed(2) }
        </button>
      </div>


      <form onSubmit={handleSubmit}>


        <CardElement />
        <button  type="submit">
          Pay
        </button>
      </form>
    </>
  );
}
```