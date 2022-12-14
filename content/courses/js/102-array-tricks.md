---
title: Array Tricks
description: Useful techniques for working with JS arrays
weight: 27
lastmod: 2022-11-11T10:23:30-09:00
draft: false
vimeo: 773489518
emoji: 🍟
video_length: 3:25
quiz: true 
---

<quiz-modal options="for of:for in:forEach:map" answer="for in" prize="8">
  <h6>Which looping method is NOT recommended in most situations?</h6>
</quiz-modal>

## Create a Range of Numbers

```js
const range = Array(100).fill(0).map((_, i) => i + 1);

// OR

const range = [...Array(100).keys()];
```

## Remove Duplicates from an Array

```js
const unique = [...new Set(arr)];
```

## Get a Random Element

```js
const random = arr[Math.floor(Math.random() * arr.length)];
```

## Loop over a Key-Value Pair

```js
for(const [i, val] of arr.entries()) {
    console.log(i, val);
}
```

## Homework: Array Methods to Study

```js
arr.forEach();
arr.map()
arr.filter();
arr.find();
arr.findIndex();
arr.reduce();
```