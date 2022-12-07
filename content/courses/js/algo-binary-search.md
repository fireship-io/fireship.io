---
title: Binary Search
description: How to implement binary search in JavaScript
weight: 31
lastmod: 2022-11-11T10:23:30-09:00
draft: false
vimeo: 773492583
emoji: 🔪
video_length: 3:16
quiz: true
---

<quiz-modal options="O(1):O(log n):O(n):O(n^2)" answer="O(log n)" prize="10">
  <h6>What is the time complexity of binary search?</h6>
</quiz-modal>

[Binary search](https://en.wikipedia.org/wiki/Binary_search_algorithm) is a faster way to find an item in a sorted array with O(log n) time complexity, compared to a regular loop with O(n) time complexity.

## Binary Search Interview Question

Create a function that takes a sorted array and a target value. Return the index of the target value in the array. If the target value is not in the array, return -1.

## Binary Search Implementation

```js
function search(arr, target, start=0, end=arr.length-1) {

    console.log(start, end)

    if (start > end) {
        console.log('Not found!');
        return -1;
    } 

    const middle = Math.floor( (start + end) / 2 );

    if (arr[middle] === target) {
        console.log(`${target} Found at index ${middle}`);
        return middle;
    } 

    if(arr[middle] > target) {
        return search(arr, target, start, middle-1);
    }

    if(arr[middle] < target) {
        return search(arr, target, middle+1, end);
    }

}

const arr = ['a', 'b', 'c', 'x', 'y', 'z'];
console.log(search(arr, 'b'));
```