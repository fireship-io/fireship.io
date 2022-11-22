---
title: Prototype Chain
description: How does Prototypal Inheritance work?
weight: 20
lastmod: 2022-11-11T10:23:30-09:00
draft: false
vimeo: 773489954
emoji: 🔗
video_length: 2:04
quiz: true
free: true
chapter_start: Advanced Concepts
---

<quiz-modal options="Function:Object:Primitive:Iterable" answer="Object" prize="0">
  <h6>Which class does an Array inherit from?</h6>
</quiz-modal>

## Prototype Chain

The [prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain) is a mechanism that allows objects to inherit properties and methods from other objects. Every object can have exactly one prototype object. That prototype object can also have a prototype object, and so on, creating a chain of inheritied properties and methods. The end of this chain is called the `null` prototype.

In general, you don't need to think about the prototype chain when doing everyday JavaScript development. However, it is important to understand how it works because it's the basis for the `class` keyword and essential knowledge as you dive deeper into the language.

In the example below, we see how an dog can inherit properties from the animal object, which itself inherits properties from the root `Object.prototype`.

```js
const animal = {
  dna: 'ATCG',
};

const dog = {
  face: '🐺',
}

Object.setPrototypeOf(dog, animal);

Object.getPrototypeOf(dog) === animal; // true

Object.getPrototypeOf(animal) === Object.prototype; // true

Object.getPrototypeOf(Object.prototype) === null; // true
```
