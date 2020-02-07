---
title: Callable Cloud Functions?
lastmod: 2019-02-27T09:32:30-07:00
draft: false
description: How callable Firebase Cloud Functions work
weight: 8
emoji: ☎️
vimeo: 320656186
chapter_start: Callable Firebase Cloud Functions
---

[Git Branch 3](https://github.com/codediodeio/stripe-firebase-master-course/tree/3-callable-functions/functions)

{{< file "typescript" "index.ts" >}}
{{< highlight typescript >}}
import * as functions from 'firebase-functions';

export const testFunction = functions.https.onCall( async (data, context) => {
    const uid  = context.auth && context.auth.uid;
    const message = data.message;

    return `${uid} sent a message of ${message}`
});
{{< /highlight >}}


Callable functions make it possible to call HTTP cloud functions with the user's Firebase auth context. This can dramatically simplify our code because it means we no longer need to manually validate auth headers in our cloud functions.

{{< file "terminal" "command line" >}}
{{< highlight text >}}
firebase init hosting 

firebase deploy --only functions

firebase serve
{{< /highlight >}}