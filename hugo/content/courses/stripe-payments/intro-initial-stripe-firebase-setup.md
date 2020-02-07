---
title: Project Setup
lastmod: 2019-02-27T09:32:30-07:00
draft: false
description: Get a basic backend project started with Stripe (NodeJS) & Firebase Cloud Functions. 
# free: true
vimeo: 320654371
weight: 3
emoji: 👶
---

[Git Branch 1](https://github.com/codediodeio/stripe-firebase-master-course/tree/1-initial-setup)

In this section, we accomplish the following tasks

1. Create a new [Firebase Project](https://google.firebase.com) and make sure to enable billing. Your project will still be free on the Blaze plan.
2. Initialize Cloud Functions by running `firebase init functions`. This repo uses TypeScript, but feel free to use vanilla JS and omit the type annotations where applicable.
3. Signup for [Stripe](https://stripe.com/) and the API key to the functions environment.
4. Initialize Firebase Admin & the Stripe Node SDK


{{< file "terminal" "command line" >}}
{{< highlight text >}}
firebase init functions

cd functions
npm i stripe
npm i @types/stripe -D
{{< /highlight >}}

{{< file "typescript" "config.ts" >}}
{{< highlight typescript >}}

// Initialize Firebase Admin
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// Initialize Cloud Firestore Database
export const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

// ENV Variables
export const stripeSecret = functions.config().stripe.secret;

// Export Stripe
import * as Stripe from 'stripe'; 
export const stripe = new Stripe(stripeSecret);

{{< /highlight >}}