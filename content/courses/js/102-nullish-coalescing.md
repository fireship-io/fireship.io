---
title: Nullish Coalescing
description: How nullish coalescing is realted to truthy and falsy values
weight: 24
lastmod: 2022-11-11T10:23:30-09:00
draft: false
vimeo: 773489885
emoji: 🦺
video_length: 1:12
quiz: true
---

<quiz-modal options="undefined:null:0:-1" answer="-1" prize="5">
  <h6>Which one of these values is truthy? </h6>
</quiz-modal>


## Nullish Coalescing

Nullish coalescing is a relativly new operator that was introduced in ES2020. It is similar to the logical OR operator `||`, but it only returns the right-hand side if the left-hand side is `null` or `undefined`. 

```js
const foo = null ?? 'bar';
console.log(foo); // 'bar'

const foo = 0 ?? 'bar';
console.log(foo); // 0
```
```