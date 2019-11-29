---
title: Firestore Rate Limiting
lastmod: 2019-09-23T08:11:12-07:00
publishdate: 2019-09-23T08:11:12-07:00
author: Jeff Delaney
draft: false
description: Advanced techniques for rate-limiting Firestore writes without Cloud Functions. 
tags: 
    - firebase
    - auth
    - pro

youtube: 
github: 
vimeo: 362111823

versions:
   firebase-rules: 2.0.0
pro: true
---

[Rate limiting](https://github.com/firebase/firebase-js-sdk/issues/647) is the process of blocking access to cloud resources after a certain threshold has been reached. Firestore bills bases on the quantity of reads and writes, but does not currently provide a way to block IPs or set explicit rate limits with [Security Rules](https://fireship.io/snippets/firestore-rules-recipes/). So how do you prevent a [DDoS](https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/) attack or just a bad user spamming the app with unnecessary records.

The following examples are based on a project management app that needs to...

- Limit users to 5 documents per account (absolute threshold). 
- Limit users to 100 writes per day (time-based). 

{{% box icon="hazard" class="box-red" %}}
Never use a rule like `allow write: true` in your database. I cannot imagine a case where this would be a safe. 
{{% /box %}}


## Rate Limit by Quantity

### Scenario

A user is limited to 5 projects per account. Imagine a SaaS app that expects to increase limits through paid accounts. 

### Data Model

This implementation requires two documents. First, you have the main UI data located somewhere like `projects/{id}`. Second, you need a document that stores the current project count that is connected to the current user, like `metadata/{uid}`.


IMG


In the app, you must perform a batch write to update the canonical document, in addition to the couter. 

{{< file "js" "app.js" >}}
{{< highlight javascript >}}

{{< /highlight >}}

### Security Rules

## Rate Limit By Time

### Scenario

Image we have a project management app. The user is limited to 10 projects per 24-hour period. 

## Rate Limit 

### Data Model

## Additional Considerations

### Email Notifications

Consider setting transactional email (via Firebase Cloud Functions or Extenisons) to notify yourself, your developers, or admins when a rate-limit threshold has been reached. It is likely something you want to investigate further and potentially disable the offending user's account. 

### IP Address Rate Limiting

It is of course possible to enforce IP restrictions on the server. If this is a critical feature, you can bypass the Firebase SDK and implement your own custom [IP address security](https://firebase.google.com/docs/auth/admin/manage-sessions#advanced_security_enforce_ip_address_restrictions) logic in a Cloud Function. You will lose the ability to enforce regular Firestore security rules and not be able to perform realtime updates, but you will have full control over the security implementation. 






