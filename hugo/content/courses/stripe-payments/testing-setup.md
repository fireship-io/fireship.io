---
title: Testing Setup with Jest
lastmod: 2019-02-27T09:32:30-07:00
draft: false
description: Configure Jest with Firebase Cloud Functions testing utilities. 
weight: 6
emoji: 🔬
vimeo: 320655594
---

{{< file "typescript" "test-config.ts" >}}
{{< highlight typescript >}}
import * as TestFunctions from 'firebase-functions-test';

const firebaseConfig = {
    databaseURL: "https://your-app.firebaseio.com",
    projectId: "your-app",
    storageBucket: "your-app.appspot.com",
}

const envConfig = { stripe: { secret: 'sk_test_yourkey' }};

const fun = TestFunctions(firebaseConfig, 'service-account.json')

fun.mockConfig(envConfig);

export { fun };
{{< /highlight >}}