---
title: Stripe API Keys Explanation
lastmod: 2019-02-27T09:32:30-07:00
draft: true
description: What are Stripe API Keys used for and how do we configure them in Firebase? 
weight: 5
emoji: 💶
free: true
vimeo: 320654205
---

As of September 2019, many European banks now require their customers to validate payments using [3D secure standard](https://stripe.com/guides/3d-secure-2) or Strong Customer Authentication SCA. As a developer, this means some users may be required to authenticate on their bank's website to validate a purchase. There are several strategies for handling this process: 

### Option 0 - Do Nothing

Not every payment system needs SCA - [find out](https://stripe.com/docs/strong-customer-authentication/doineed) if you are affected first. 

### Option 1 - Stripe Checkout

[Stripe Checkout](https://stripe.com/payments/checkout) is a drop-in payment solution that works with 3D secure, but has limited options for UI customization and does not work with coupons. 


### Option 2 - Redirect to Invoice

Stripe can host invoices for your customers. When 3D Secure is required, you can simply redirect your user to this invoice page to finish the payment, then use a webhook to fulfill the order. 

### Option 3 - Implement a Payment Intent Flow

The Payments API allows you to handle the entire process in your app. It is the most complex to setup, but provides full control over the UI and [steps involved](https://stripe.com/docs/payments/intents#intent-statuses) in the process. 

