---
title: TDD with Vitest
description: How to test JavaScript code with Vitest
weight: 32
lastmod: 2022-11-11T10:23:30-09:00
draft: false
vimeo: 773493175
emoji: 🧪
video_length: 2:05
---

Use [Vitest](https://vitest.dev/) to create a few basic unit test for the algorithims in the previous lessons. 

```shell
npm init -y
npm i -D vitest
```

Update the package.json with a test script. 

{{< file "npm" "package.json" >}}
```json
  "scripts": {
    "test": "vitest"
  },
```

## Vitest Basic Example

```js
import { expect, test } from 'vitest';

import { cumSum } from './sum';
test('cumulative sum of an array', () => {
  expect(cumSum([1, 3, 5, 7])).toBe(16);
  expect(cumSum([-2, -4, -8])).toBe(-14);
});
```
