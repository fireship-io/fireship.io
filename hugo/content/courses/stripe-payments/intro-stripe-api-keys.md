---
title: Stripe API Keys Explanation
lastmod: 2019-02-27T09:32:30-07:00
draft: false
description: What are Stripe API Keys used for and how do we configure them in Firebase? 
weight: 4
emoji: 👶
free: true
vimeo: 320654205
---

{{< file "terminal" "command line" >}}
{{< highlight text >}}
# add the secret key to the environment
firebase functions:config:set stripe.secret="sk_your_test_key"
{{< /highlight >}}