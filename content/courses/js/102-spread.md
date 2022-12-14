---
title: Spread
description: Use the spread syntax to combine objects  
weight: 22
lastmod: 2022-11-11T10:23:30-09:00
draft: false
vimeo: 773490104
emoji: 👫
video_length: 1:26
quiz: true
---

<quiz-modal options="1:4:null" answer="1" prize="3">
  <h6>What is the value of property foo below?</h6>
<pre>
const obj = { 
    foo: 1, 
    bar: 2, 
    baz: 3 
};
const newObj = {
    foo: 4
    ...obj,
};
</pre>
</quiz-modal>

## Spread Syntax

The spread syntax `...` is a relatively new operator that was introduced in ES2018. It provides a concise way to combine objects and arrays. 

```js
const obj = { 
    foo: 1, 
    bar: 2, 
    baz: 3 
};
const newObj = {
    foo: 4
    ...obj,
};
console.log(newObj); // { foo: 1, bar: 2, baz: 3 }
```

It's also useful for combining arrays. 

```js
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const arr3 = [...arr1, ...arr2];
```