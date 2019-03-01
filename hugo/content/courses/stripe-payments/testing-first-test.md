---
title: First Unit Test
lastmod: 2019-02-27T09:32:30-07:00
draft: false
description: Write a basic unit test to validate that Stripe & Firebase are initialized properly. 
weight: 7
emoji: 🔬
vimeo: 320655439
---

{{< file "typescript" "main.test.ts" >}}
{{< highlight typescript >}}
import { fun } from './test-config';
fun.cleanup;

import { db, stripe } from '../src/config';


test('Firestore is initialized', () => {
    expect(db).toBeDefined();
});

test('Stripe is initialized', () => {
    expect(stripe).toBeDefined();

});

{{< /highlight >}}