---
title: Stripe Elements and Checkout with Angular
lastmod: 2019-03-04T08:48:04-07:00
publishdate: 2019-03-04T08:48:04-07:00
author: Jeff Delaney
draft: false
description: Create a form that collects and validates credit card details in Angular with Stripe Elements & Checkout.  
tags: 
    - stripe
    - angular
    - firebase
    - payments

youtube: zTj0FZHunNE
github: https://github.com/fireship-io/171-stripe-elements-angular

versions:
   angular: 7.3
   firebase: 5.5
   stripejs: 3
---

💰 Are you building a payment solution with Stripe? Consider enrolling the [Stripe JavaScript Master Course](/courses/stripe). 

[Stripe](https://stripe.com/docs/stripe-js) provides several JavaScript libraries - Stripe Elements & Checkout - that makes it easy to collect and validate payment sources like credit cards, bank accounts, and more. The following lesson will show you how to integrate Stripe's clientside JS packages into an Angular application. 

## Step 0. Prerequisites


This lesson only covers the frontend code. Building a custom pament solution also requires backend code, which is covered in the [Stripe Payments Master Course](/courses/stripe-payments/) using callable Firebase Cloud Functions. 


1. Install AngularFire `ng add @angular/fire`
1. Signup for a [Stripe Account](https://stripe.com/)


## Step 1. Initial Setup


### User Authentication

It's possible to accept payments without user authentication in place, but most payment systems are coupled to the app's user record. Below is a simplified authentiaction service, but make sure to watch the [Firebase OAuth](/lessons/angularfire-google-oauth/) with Angular lesson for in-depth coverage of this topic. Basically, we just sign-in with Google and provide a helper method to return the current user as a promise. 

{{< file "ngts" "auth.service.ts" >}}
```typescript
import { Injectable } from '@angular/core';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private afAuth: AngularFireAuth) {}

  googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  async getUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

}
```


### Optional: Install Stripe Types

Although optional, I highly recommended installing the [typings for Stripe Checkout](https://www.npmjs.com/package/@types/stripe-checkout) and [Elements](https://www.npmjs.com/package/@types/stripe-v3) to get autocomplete in your IDE with TypeScript. 

{{< file "terminal" "command line" >}}
```text
npm install --D @types/stripe-checkout
npm install --D @types/stripe-v3
```


## Stripe Checkout - Quick and Easy

[Stripe Checkout](https://stripe.com/docs/checkout) is the quickest and easiest way to accept credit card payments, but does not offer much flexibility when it comes to customizing the checkout experience. 

{{< file "terminal" "command line" >}}
```text
ng g component checkout
```

{{< vimeo 321477809 >}}

### Add Stripe Checkout to the App

First, we need to include stripe's checkout script in the head of the HTML. 

{{< file "html" "index.html" >}}
```html
<script src="https://checkout.stripe.com/checkout.js"></script>
```

### Create a Checkout Handler

Next, let's create a component that can handle the checkout. The `source` callback is called after stripe responds with a valid payment source. Your job is send this data to your backend server and process a charge or attach it to a customer record. The example below uses a callable Firebase Cloud Function - again, this process is covered in detail the Stripe Payments Master Course. 

{{< file "ngts" "checkout.component.ts" >}}
```typescript
import { Component, OnInit, Input, HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFireFunctions } from '@angular/fire/functions';

declare var StripeCheckout: StripeCheckoutStatic;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  constructor(private auth: AuthService, private functions: AngularFireFunctions) {}

  @Input() amount;
  @Input() description;

  handler: StripeCheckoutHandler;

  confirmation: any;
  loading = false;

  ngOnInit() {
    this.handler = StripeCheckout.configure({
      key: 'pk_test_your_key',
      image: '/your-avatar.png',
      locale: 'auto',
      source: async (source) => {
        this.loading = true;
        const user = await this.auth.getUser();
        const fun = this.functions.httpsCallable('stripeCreateCharge');
        this.confirmation = await fun({ source: source.id, uid: user.uid, amount: this.amount }).toPromise();
        this.loading = false;

      }
    });
  }

  // Open the checkout handler
  async checkout(e) {
    const user = await this.auth.getUser();
    this.handler.open({
      name: 'Fireship Store',
      description: this.description,
      amount: this.amount,
      email: user.email,
    });
    e.preventDefault();
  }

  // Close on navigate
  @HostListener('window:popstate')
  onPopstate() {
    this.handler.close();
  }

}

```


The HTML is dead simple. Just bind the `checkout` method to a button click. 

{{< file "html" "checkout.component.html" >}}
```html
<button (click)="checkout($event)">
  
  Buy for ${{ amount / 100 }}.00

</button>

<hr>

<div *ngIf="loading">Loading....</div>
```


## Stripe Elements - Highly Customizable 

Stripe Elements gives you more fine-grained control over payment form, but without need to code up all the complex validation logic from scratch. 

{{< vimeo 321487596 >}}

### Add Elements to the HTML

{{< file "html" "index.html" >}}
```html
<script src="https://js.stripe.com/v3/"></script>
```

### Mount a Card Form to a Component

The Elements Card follows a similar process to Checkout, but we can customize each field of the form itself with our own styles and error handling. 

{{< file "ngts" "elements.component.ts" >}}
```typescript
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFireFunctions } from '@angular/fire/functions';

declare var Stripe; // : stripe.StripeStatic;

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.scss']
})
export class ElementsComponent implements OnInit {


  constructor(private auth: AuthService, private functions: AngularFireFunctions) {}

  @Input() amount: number;
  @Input() description: string;
  @ViewChild('cardElement') cardElement: ElementRef;

  stripe; // : stripe.Stripe;
  card;
  cardErrors;

  loading = false;
  confirmation;


  ngOnInit() {
    this.stripe = Stripe('pk_test_your_key');
    const elements = this.stripe.elements();

    this.card = elements.create('card');
    this.card.mount(this.cardElement.nativeElement);

    this.card.addEventListener('change', ({ error }) => {
        this.cardErrors = error && error.message;
    });
  }

  async handleForm(e) {
    e.preventDefault();

    const { source, error } = await this.stripe.createSource(this.card);

    if (error) {
      // Inform the customer that there was an error.
      this.cardErrors = error.message;
    } else {
      // Send the token to your server.
      this.loading = true;
      const user = await this.auth.getUser();
      const fun = this.functions.httpsCallable('stripeCreateCharge');
      this.confirmation = await fun({ source: source.id, uid: user.uid, amount: this.amount }).toPromise();
      this.loading = false;

    }
  }
}
```

The HTML requires a form with a template variable that we can mount the card to, which is the *cardElement* in this example. When the form is submitted, the *handleForm* method will send the card details to Stripe and process a charge on our server. 


{{< file "html" "elements.component.html" >}}
```html
<form (submit)="handleForm($event)">


    <div #cardElement>
      <!-- A Stripe Element will be inserted here. -->
    </div>


    <!-- Used to display Element errors. -->
    <p>{{ cardErrors }}</p>


  <button >Buy for ${{ amount / 100 }}.00</button>
</form>

```
