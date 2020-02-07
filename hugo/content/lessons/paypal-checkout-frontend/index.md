---
title: PayPal Checkout
lastmod: 2019-06-23T06:44:00-07:00
publishdate: 2019-06-23T06:44:00-07:00
author: Jeff Delaney
draft: false
description: Accept PayPal Checkout payments with Angular, React, or Vue
tags: 
    - angular
    - react
    - vue
    - payments
    - paypal

youtube: AtZGoueL4Vs
github: https://github.com/fireship-io/193-paypal-checkout-v2-demos
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

In February 2019, the PayPal Checkout API received a much needed [facelift](https://medium.com/paypal-engineering/launch-v2-paypal-checkout-apis-45435398b987) that brought massive improvements to the developer experience. The new [v2 API](https://developer.paypal.com/docs/api/overview/) has detailed documentation on par with [Stripe](/tags/stripe) and offers one of the smoothest paths to start accepting payments and/or subscriptions in a progressive web app. The following lesson will show you how to start accepting payments entirely from your frontend JavaScript code with PayPal Checkout with your choice of Angular, React, and Vue. 

{{< box icon="money" class="box-green" >}}
If you're looking to implement a fullstack payment solution, check out the [Stripe Payments Master Course](/courses/stripe). Ironically, you can pay for it with PayPal if you prefer 🤷. Both PayPal and Stripe share similar APIs, so concepts from the course overlap both APIs.  
{{< /box >}}

## Live Demo

The button below is the actual *live* implementation used for Fireship (Angular Elements). Try it 👇

<product-select class-name="btn btn-lg" product-id="proLifetime" text="Upgrade for Life 🦄🚀"></product-select>
<payment-form></payment-form>


## Initial Setup

### PayPal Credentials

Create an new REST API app from the [PayPal developer applications](https://developer.paypal.com/developer/applications/) screen. PayPal provides two sets of API keys. The *sandbox* keys are used for testing, while the *live* keys are used to process real payments.

Each set of keys contains a *client ID* and *secret*. For basic checkout integrations, you only need the Client ID and can capture charges entirely from the frontend. Optionally, you can use the secret key to capture charges on a backend server (never expose the secret key in the frontend code or a public git repo). 


{{< figure src="img/paypal-api-credentials.png" caption="PayPal API credentials" >}}



### Testing 

PayPal provides testing accounts that you can use to make mock transactions. Change the password to something you'll remember and use it to test out your first payment. 

{{< figure src="img/paypal-mock-account.png" caption="Mock PayPal accounts for payment testing" >}}


## Angular

### Generate the App

Create a new [Angular](https://angular.io/) project with the CLI. 

{{< file "terminal" "command line" >}}
{{< highlight text >}}
ng new myApp
{{< /highlight >}}

### Add the PayPal Script Tag

In Angular, we can simply include the script in the head of the HTML. Replace the value of the Client ID. 

{{< file "html" "index.html" >}}
{{< highlight html >}}
<head>

  <!-- ... other stuff -->
  <script
    src="https://www.paypal.com/sdk/js?client-id=YOUR-CLIENT-ID">
  </script>
</head>
{{< /highlight >}}

### Payment Component

In the HTML, we need a template reference of a DOM element that PayPal will replace with the button. 

{{< file "html" "some.component.html" >}}
{{< highlight html >}}
<div *ngIf="!paidFor">
  <h1>Buy this Couch - ${{ product.price }} OBO</h1>
</div>

<div *ngIf=paidFor>
  <h1>Yay, you bought a sweet couch!</h1>
</div>


<div #paypal></div>
{{< /highlight >}}


{{< file "ngts" "some.component.ts" >}}
{{< highlight typescript >}}
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare var paypal;

@Component({
  selector: 'app-payme',
  templateUrl: './payme.component.html',
  styleUrls: ['./payme.component.css']
})
export class PaymeComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  product = {
    price: 777.77,
    description: 'used couch, decent condition',
    img: 'assets/couch.jpg'
  };

  paidFor = false;

  ngOnInit() {
    paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: this.product.description,
                amount: {
                  currency_code: 'USD',
                  value: this.product.price
                }
              }
            ]
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          this.paidFor = true;
          console.log(order);
        },
        onError: err => {
          console.log(err);
        }
      })
      .render(this.paypalElement.nativeElement);
  }
}

{{< /highlight >}}

## React

The react implementation takes advantage of Hooks to manage state and initialize the PayPal script tag. 

### Generate the App

Create a new [React](https://reactjs.org/) project with create-react-app. 
{{< file "terminal" "command line" >}}
{{< highlight text >}}
npx create-react-app my-app
{{< /highlight >}}

### Payment Component

{{< file "js" "App.js" >}}
{{< highlight jsx >}}
import './App.css';
import React, { useState, useRef, useEffect } from 'react';

function Product({ product }) {
  const [paidFor, setPaidFor] = useState(false);
  const [error, setError] = useState(null);
  const paypalRef = useRef();

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: product.description,
                amount: {
                  currency_code: 'USD',
                  value: product.price,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          setPaidFor(true);
          console.log(order);
        },
        onError: err => {
          setError(err);
          console.error(err);
        },
      })
      .render(paypalRef.current);
  }, [product.description, product.price]);

  if (paidFor) {
    return (
      <div>
        <h1>Congrats, you just bought {product.name}!</h1>
        <img alt={product.description} src={gif} />
      </div>
    );
  }

  return (
    <div>
      {error && <div>Uh oh, an error occurred! {error.message}</div>}
      <h1>
        {product.description} for ${product.price}
      </h1>
      <div ref={paypalRef} />
    </div>
  );
}

function App() {
  const product = {
    price: 777.77,
    name: 'comfy chair',
    description: 'fancy chair, like new',
    image: chair,
  };

  return (
    <div className="App">
      <Product product={product} />
    </div>
  );
}

export default App;
{{< /highlight >}}


## Vue

### Generate the App

Create a new [Vue](https://vuejs.org/) app with the Vue CLI
{{< file "terminal" "command line" >}}
{{< highlight text >}}
vue create my-app
{{< /highlight >}}

### Payment Component

{{< file "vue" "Payments.vue" >}}
{{< highlight jsx >}}
<template>
  <div>
    <div v-if="!paidFor">
      <h1>Buy this Lamp - ${{ product.price }} OBO</h1>

      <p>{{ product.description }}</p>

    </div>

    <div v-if="paidFor">
      <h1>Noice, you bought a beautiful lamp!</h1>
    </div>

    <div ref="paypal"></div>
  </div>
</template>

<script>
// import image from "../assets/lamp.png"
export default {
  name: "HelloWorld",

  data: function() {
    return {
      loaded: false,
      paidFor: false,
      product: {
        price: 777.77,
        description: "leg lamp from that one movie",
        img: "./assets/lamp.jpg"
      }
    };
  },
  mounted: function() {
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=YOUR-CLIENT-ID";
    script.addEventListener("load", this.setLoaded);
    document.body.appendChild(script);
  },
  methods: {
    setLoaded: function() {
      this.loaded = true;
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: this.product.description,
                  amount: {
                    currency_code: "USD",
                    value: this.product.price
                  }
                }
              ]
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            this.paidFor = true;
            console.log(order);
          },
          onError: err => {
            console.log(err);
          }
        })
        .render(this.$refs.paypal);
    }
  }
};
</script>
{{< /highlight >}}




