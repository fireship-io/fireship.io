---
title: Callable Functions Error Handing
lastmod: 2019-02-27T09:32:30-07:00
draft: false
description: How to handler errors and validate data in a callable function
weight: 10
emoji: ☎️
vimeo: 320657367
---


{{< file "ngts" "helpers.ts" >}}
{{< highlight typescript >}}
import * as functions from 'firebase-functions';

/**
Validates data payload of a callable function
*/
export const assert = (data: any, key:string) => {
    if (!data[key]) {
        throw new functions.https.HttpsError('invalid-argument', `function called without ${key} data`);
    } else {
        return data[key];
    }
}

/**
Validates auth context for callable function 
*/
export const assertUID = (context: any) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('permission-denied', 'function called without context.auth');
    } else {
        return context.auth.uid;
    }
}

/**
Sends a descriptive error response when running a callable function
*/
export const catchErrors = async (promise: Promise<any>) => {
    try {
        return await promise;
    } catch(err) {
        throw new functions.https.HttpsError('unknown', err)
    }
}
{{< /highlight >}}