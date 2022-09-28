---
title: React Setup
description: Configure a React project for Stripe Payments 
weight: 18
lastmod: 2020-04-20T10:23:30-09:00
draft: false
vimeo: 416486693
icon: react
video_length: 2:47
---


## Create a React App


{{< file "terminal" "command line" >}}
```text
npx create-react-app myapp
```

## Setup Stripe

{{< file "js" "command line" >}}
```text
npm install @stripe/react-stripe-js @stripe/stripe-js
```

{{< file "react" "index.js" >}}
```jsx
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(
  'pk_test_...'
);

ReactDOM.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
        <App />
    </Elements>
  </React.StrictMode>,
  document.getElementById('root')
);
```

## React Router

{{< file "terminal" "command line" >}}
```text
npm install react-router-dom
```

Create empty files for the components referenced in the router below, like Checkout.js, Payments.js, etc. 

{{< file "react" "App.js" >}}
```jsx
import React from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { Checkout, CheckoutSuccess, CheckoutFail } from './Checkout';
import Payments from './Payments';
import Customers from './Customers';
import Subscriptions from './Subscriptions';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul className="navbar-nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/checkout">
                <span aria-label="emoji" role="img">
                  🛒
                </span>{' '}
                Checkout
              </Link>
            </li>
            <li>
              <Link to="/payments">
                <span aria-label="emoji" role="img">
                  💸
                </span>{' '}
                Payments
              </Link>
            </li>
            <li>
              <Link to="/customers">
                <span aria-label="emoji" role="img">
                  🧑🏿‍🤝‍🧑🏻
                </span>{' '}
                Customers
              </Link>
            </li>
            <li>
              <Link to="/subscriptions">
                <span aria-label="emoji" role="img">
                  🔄
                </span>{' '}
                Subscriptions
              </Link>
            </li>
          </ul>
        </nav>

        <main>
          <Switch>
            <Route path="/checkout">
              <Checkout />
            </Route>
            <Route path="/payments">
              <Payments />
            </Route>
            <Route path="/customers">
              <Customers />
            </Route>
            <Route path="/subscriptions">
              <Subscriptions />
            </Route>
            <Route path="/success">
              <CheckoutSuccess />
            </Route>
            <Route path="/failed">
              <CheckoutFail />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <>
      <h2>Stripe React + Node.js</h2>
    </>
  );
}

export default App;
```