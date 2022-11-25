---
title: Cumulative Sum
description: Solving basic algorithms with plain JavaScript
weight: 30
lastmod: 2022-11-11T10:23:30-09:00
draft: false
vimeo: 773493017
emoji: 🥣
video_length: 3:10
quiz: true
chapter_start: Algorithms
---

<quiz-modal options="Four:Six:Seven:Eleven" answer="Seven" prize="11">
  <h6>I am an odd number. Take away one letter and I become even. What number am I?</h6>
</quiz-modal>

## Cumulative Sum Interview Question

Create a function that takes an array of numbers and returns a number that is the sum of all values in the array.

## Cumulative Sum Implementation

```js
// Solution 1
function cumSum(arr) {
    return arr.reduce((acc, cur) => acc + cur, 0);
}

// Solution 2
export function cumSum(arr) {
  let total = 0;
  
  for(let i = 0; i < arr.length; i++) {
    total += arr[i];
  } 
  
  return total;
}

console.log('sum: ', cumSum([1,3,5,7]));
```