---
title: Payment Experience 
description: Four ways to accept Stripe payments
weight: 5
lastmod: 2024-03-22T10:23:30-09:00
draft: false
vimeo: 927619910
emoji: 💳
video_length: 3:21
---


## Payment Experience

Stripe provides multiple ways to integrate payments into your application, catering to different use cases and developer preferences. Let's take a closer look at the options available.

### Payment Links

Payment Links offer the simplest way to start accepting payments. With Payment Links, you can create a shareable URL that directs customers to a pre-built payment page hosted by Stripe. This option requires minimal development effort and allows you to start accepting payments quickly.

### Stripe Checkout

Stripe Checkout is a customizable payment flow that provides a pre-built, mobile-optimized checkout experience. It handles the entire payment process, including collecting customer information, processing payments, and managing subscriptions.

Integrating Stripe Checkout into your application is straightforward. By including the Stripe Checkout JavaScript library and configuring a few parameters, you can embed a "Pay with Card" button that launches the Stripe Checkout modal. Customers can then enter their payment details, and upon successful payment, they are redirected back to your application.

### Stripe Elements

For more control over the payment experience, Stripe Elements allows you to build custom checkout forms directly within your application. Elements provides a set of UI components that securely collect sensitive payment information, such as credit card details, while ensuring a consistent and stylish appearance across different browsers and devices.You have the flexibility to design your own checkout flow and maintain full control over the user experience. You can customize the look and feel of the form elements to match your application's branding and style.

### REST API

If you require a more low-level approach or need to build a custom payment flow, Stripe's REST API provides a set of bare-bones endpoints for managing payments, customers, subscriptions, and more. With the REST API, you have complete control over the payment process and can integrate Stripe's functionality into your application at a granular level.