---
title: Higher Order Functions
description: What is a higer order function or HOF?
weight: 25
lastmod: 2022-11-11T10:23:30-09:00
draft: false
vimeo: 773489811
emoji: 🔱
video_length: 2:15
quiz: true
---

<quiz-modal options="function foo() { ... }:const foo = () => ..." answer="function foo() { ... }" prize="6">
  <h6>Which one is a function declaration?</h6>
</quiz-modal>

## Higher Order Functions

A higher order function is a function that takes a function as an argument, or returns a function. They are commonly used in functional programming, and are a powerful tool for abstracting away complexity. 

```js

// A function that takes a function as an argument
function add(x, y) {
  return x + y;
}
function subtract(x, y) {
  return x - y;
}
function math(x, y, operator) {
  return operator(x, y);
}

math(5, 2, add); // 7
```