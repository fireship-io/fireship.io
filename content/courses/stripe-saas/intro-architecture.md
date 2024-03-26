---
title: Architecture 
description: Example SaaS architecture with Stripe
weight: 6
lastmod: 2024-03-22T10:23:30-09:00
draft: false
vimeo: 927619885
emoji: 🏛️
video_length: 2:06
free: true
---


### Example Stripe Architecture

![Stripe SaaS Architecture](/courses/stripe-saas/img/stripe-architecture.png)

Here's a summary of the key steps:
#### 1. Product & Price Setup
- Create a product in the Stripe dashboard representing your service.
- Define prices for the product (e.g., $20/month).
#### 2. Initiate Payment
- User clicks "Buy Now" button on your website.
- Your server generates a Stripe Checkout session with the relevant price ID.
- User gets redirected to Stripe's secure checkout page.
#### 3. Payment & Fulfillment
- User enters payment details on Stripe's checkout page.
- Upon successful payment, Stripe creates customer, payment, charge, and subscription records.
- Stripe sends a webhook to your server with checkout session information.
- Your server updates your database and sends a confirmation email to the user.
#### 4. Subscription Management
- User can cancel their subscription through a Stripe-hosted portal.
- Stripe sends a webhook notifying your server about the cancellation.
- Your server updates the user's record in your database accordingly.