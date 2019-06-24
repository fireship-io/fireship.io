---
title: PayPal Payments with Firebase
lastmod: 2019-06-23T06:44:00-07:00
publishdate: 2019-06-23T06:44:00-07:00
author: Jeff Delaney
draft: true
description: Accept PayPal payments in your Firebase app. 
tags: 
    - firebase
    - cloud-functions
    - payments
    - paypal

youtube: 
github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

PayPal 

If you're looking to implement a fullstack payment solution, check out the Stripe Payments Master Course. Both PayPal and Stripe share similar APIs, so can share much of the same logic between them. 


## Initial Setup

### Initial Functions

First, initialize Firebase functions in your project. 

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
npm i -g firebase-tools

firebase init functions
# select YES for typescript
{{< /highlight >}}

### PayPal Credentials

Create an application from the [PayPal developer]() dashboard. PayPal provides two sets of API keys. The *sandbox* keys are used for testing, while the *live* keys are used to process real payments. This only uses the sandbox keys, but make sure deploy your app with the live keys.

{{< figure src="img/paypal-api-credential.png" caption="PayPal API credentials" >}}

Grab your credentials and save them to your Cloud Functions environment. You should have a `clientId` and `secret`. 

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
firebase functions:config:set paypal.client="your-client"  paypal.secret="your-secret"
{{< /highlight >}}



firebase functions:config:set paypal.sandboxclient="ARNRNvgJTH0oaRUrQUC-p-MgCXzIOl5T6um6YqdW7U9mkwzV-ZkfCtp9c0QH6dRWArJY85Yh3rLCT5Vu"  paypal.sandboxsecret="EFGIC2lGKB5DweunyCRv_niYGn7W9Z1TNFq5s5jj7rmlxjSNEItzOCZc4yrQqg4Z0qPILj1AkIhHoAbL"

curl -v https://api.sandbox.paypal.com/v1/oauth2/token \
   -H "Accept: application/json" \
   -H "Accept-Language: en_US" \
   -u "ARNRNvgJTH0oaRUrQUC-p-MgCXzIOl5T6um6YqdW7U9mkwzV-ZkfCtp9c0QH6dRWArJY85Yh3rLCT5Vu:EFGIC2lGKB5DweunyCRv_niYGn7W9Z1TNFq5s5jj7rmlxjSNEItzOCZc4yrQqg4Z0qPILj1AkIhHoAbL" \
   -d "grant_type=client_credentials"



## Testing 

PayPal provides testing accounts that you can use to make mock transactions. Change the password to something you'll remember and use it to test out your first payment. 

{{< figure src="img/paypal-mock-account.png" caption="Mock PayPal accounts for payment testing" >}}