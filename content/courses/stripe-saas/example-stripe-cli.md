---
title: Stripe CLI
description: Configure the Stripe CLI for local development
weight: 14
lastmod: 2024-03-22T10:23:30-09:00
draft: false
vimeo: 927619845
emoji: 🌐
video_length: 2:10
---

### Install

Install the Stripe CLI by following the [Stripe CLI Install Docs](https://stripe.com/docs/stripe-cli) page.

### Commands

```bash
stripe login

stripe listen -e checkout.session.completed --forward-to http://localhost:3000/webhook 
```




