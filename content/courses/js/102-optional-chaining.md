---
title: Optional Chaining
description: Call object properties safely 
weight: 23
lastmod: 2022-11-11T10:23:30-09:00
draft: false
vimeo: 773489916
emoji: ⛓
video_length: 1:46
quiz: true
---

<quiz-modal options="undefined:null:error:0" answer="undefined" prize="4">
  <h6>What is the return value when calling a property that does not exist with optional chaining? </h6>
</quiz-modal>

## Optional Chaining

Optional chaining `?` is a relatively new operator that was introduced in ES2020. It allows you to call object properties safely, without throwing an error. When calling properties without this operator, you many crash your applcation with the error `Cannot read property 'foo' of undefined`. 

```js
const person = { };

const dude = person.name;
console.log(foo); // Uncaught TypeError: Cannot read property 'bar' of undefined

const dude = person?.name; // undefined
```