---
title: Checkout with React
description: Complete a checkout session and redirect to a success or fail page
weight: 23
lastmod: 2020-04-20T10:23:30-09:00
draft: false
vimeo: 416760968
emoji: 
icon: react
video_length: 6:21
---

## API Fetch Helper

{{< file "js" "helpers.js" >}}
```javascript
const API = 'http://localhost:3333';

/**
 * A helper function to fetch data from your API.
 */
export async function fetchFromAPI(endpointURL, opts) {
  const { method, body } = { method: 'POST', body: null, ...opts };

  const res = await fetch(`${API}/${endpointURL}`, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res.json();
}
```

## Checkout Component

{{< file "react" "App.js" >}}
```jsx
import React, { useState } from 'react';
import { fetchFromAPI } from './helpers';
import { useStripe } from '@stripe/react-stripe-js';

export function Checkout() {
  const stripe = useStripe();

  const [product, setProduct] = useState({
    name: 'Hat',
    description: 'Pug hat. A hat your pug will love.',
    images: [
      'your-img',
    ],
    amount: 799,
    currency: 'usd',
    quantity: 0,
  });

  const changeQuantity = (v) =>
    setProduct({ ...product, quantity: Math.max(0, product.quantity + v) });

  const handleClick = async (event) => {
    const body = { line_items: [product] }
    const { id: sessionId } = await fetchFromAPI('checkouts', {
      body
    });

    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      console.log(error);
    }
  };

  return (
    <>

      <div>
        <h3>{product.name}</h3>
        <h4>Stripe Amount: {product.amount}</h4>

        <img src={product.images[0]} width="250px" alt="product" />

        <button
          onClick={() => changeQuantity(-1)}>
          -
        </button>
        <span>
          {product.quantity}
        </span>
        <button
          onClick={() => changeQuantity(1)}>
          +
        </button>
      </div>

      <hr />

      <button
        onClick={handleClick}
        disabled={product.quantity < 1}>
        Start Checkout
      </button>
    </>
  );
}

```