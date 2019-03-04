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

youtube: 
github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

versions:
   angular: 7.3
   firebase: 5.5
   stripejs: 3
---


Stripe provides serveral JavaScript libraries that makes it easy to collect and validate payment sources like credit cards, bank accounts, and more. The following lesson will show you how to integrate Stripe Elements in an Angular application. 

[Stripe Elements](https://stripe.com/docs/stripe-js/elements/quickstart)

{{% box icon="scroll" class="box-blue" %}}
This lesson only covers the frontend code. Building a custom pament solution also requires backend code, which is covered in the [Stripe Payments Master Course](/courses/stripe-payments/) using callable Firebase Cloud Functions. 
{{% /box %}}

## 0. Prerequisites

1. {{< prereq "install-angularfire" >}}
1. Signup for a [Stripe Account](https://stripe.com/)

## 1. Initial Setup

### Add Stripe 

{{< file "html" "foo.component.html" >}}
{{< highlight html >}}

{{< /highlight >}}

### User Authentication

It's possible to accept payments without user authentication in place, but most payment systems are coupled to the app's user record. Below is a simplified authentiaction service, but make sure to watch the [Firebase OAuth](/lessons/angularfire-google-oauth/) with Angular lesson for in-depth coverage of this topic. 


### 2a - Stripe Checkout

Checkout is the quickest and easiest way to accept credit card details.  


## 2b - Stripe Elements

Stripe Elements gives you more fine-grained control over payment form, but without need to code up all the complex validation logic from scratch. 