---
title: Closures
description: What is a closure?
weight: 26
lastmod: 2022-11-11T10:23:30-09:00
draft: false
vimeo: 773489636
emoji: 🥡
video_length: 2:18
quiz: true
---

<quiz-modal options="Disk:Call Stack:Heap:Dump" answer="Heap" prize="7">
  <h6>Where in memory does the JS engine store the state of a closure?</h6>
</quiz-modal>

## Closures

A closure is a function that has access to the parent scope, even after the parent function has closed. JS will automatically store the state of a closure in the heap memory, even after the parent function has returned. This behavior makes them useful for encapsulating private variables. 

```js
function encapsulatedState(x) {
  let state = 10;
  return function() {
    state += x;
    return state;
  }
}
```
