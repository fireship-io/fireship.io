---
title: Unit Testing - Why?
lastmod: 2019-02-27T09:32:30-07:00
draft: false
description: Unit testing strategy for Firebase Cloud Functions + Stripe
weight: 5
emoji: 🔬
vimeo: 320656011
chapter_start: Unit Testing 
free: true
---

[Git Branch 2](https://github.com/codediodeio/stripe-firebase-master-course/tree/2-testing)

Now it's time to put some unit tests in place. While this step is optional I highly recommend testing your payment integration because (1) one failed commit could cause you lose out on potential payments, (2) it provides a great playground for rapid development, (3) it will help you better understand your code.

Install [Jest](https://github.com/kulshekhar/ts-jest) and the [Firebase Functions Test](https://firebase.google.com/docs/functions/unit-testing) package.