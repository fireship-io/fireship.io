---
title: Destructuring
description: Use destructuring to work with objects with ease.  
weight: 21
lastmod: 2022-11-11T10:23:30-09:00
draft: false
vimeo: 773489766
emoji: 🍳
video_length: 1:41
quiz: true
---

<quiz-modal options="foo:bar:undefined" answer="bar" prize="1">
  <h6>What is the name of the variable declared below?</h6>
  <code>const { foo: bar } = { foo: 23 }</code>
</quiz-modal>

## Destructuring Examples

```js
// Object destructuring
const person = {
  name: 'John',
  age: 32,
  city: 'New York',
  country: 'USA'
};

const { name, age } = person;

// Object destructuring with alias

const { name: firstName, age: years } = person;

// Array destructuring
const fruits = ['apple', 'banana', 'orange'];
const [first, second, third] = fruits;
```
