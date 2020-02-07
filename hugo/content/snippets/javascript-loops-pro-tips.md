---
title: Javascript Iteration and Loops
lastmod: 2019-01-15T15:29:44-07:00
publishdate: 2019-01-15T15:29:44-07:00
author: Jeff Delaney
draft: false
description: Learn how Iteration and Loops Work in JavaScript
tags: 
    - javascript

type: lessons
youtube: x7Xzvm0iLCI
github: https://github.com/codediodeio/code-this-not-that-js 
featured_img: /img/snippets/js-loops-cover.jpg
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

Modern JavaScript gives you a ton of different ways to iterate or loop over values. The following snippet will look at techniques that you can use to write faster and/or more concise loops with vanilla JS. 

## The Basics

### For vs For-Of vs forEach

You have three main options when looping or iterating over values in JS. 

- `for` - fastest, but ugly on the eyes
- `for-of` - slowest, but most sugary
- `forEach` - fast and designed for functional code
- `for` (but backwards) - absolute fastest - but terrible to look at and work with

Here is a rough performance breakdown of the code when looping over 1 million items. This was run on an average desktop PC in Node 10. Notice how the `for-of` loop is 6x slower than a regular for loop - that syntatic sugar has a price. 

{{< file "js" "perf.js" >}}
{{< highlight javascript >}}
const mil = 1000000; 
const arr = Array(mil);

console.time('⏲️')


for (let i = 0; i < mil; i++) { }  // 1.6ms

for (const v of arr) {}  // 11.7ms

arr.forEach(v => v) // 2.1ms

for (let i = mil; i > 0; i--) {} // 1.5ms

console.timeEnd('⏲️');
{{< /highlight >}}


### Which One Should You Use?

The traditional `for` loop is the fastest, so you should always use that right? Not so fast -  performance is not the only thing that matters. It is rare that you will ever need to loop over 1 million items in a frontend JS app. *Code Readability* is usually more important, so default to the style that fits your application. If you prefer to write functional code, then `forEach` is ideal, while `for-of` is great otherwise. Fewer lines of code means shorter development times and less maintenance overhead - optimize for developer-happiness first, then performance later. 


## For-Of Tricks

The for-of loop has several other tricks up its sleeve. 

### Loop over Objects

Loops are not just for arrays. You can also loop over Strings, Maps, Sets, or anything that has implemented a symbol iterator - but not plain Objects. However, looping over an Object is a very common need, so let's look at our options

{{< file "js" "loop.js" >}}
{{< highlight javascript >}}
// Use a For-In Loop
const equine = { horse: '🐴', zebra: '🦓', unicorn: '🦄'}

for (const key in equine) {
    // Filters out properties inherited from prototype, see https://palantir.github.io/tslint/rules/forin/
    if (equine.hasOwnProperty(key)) {
        console.log(equine[key]);
    }
}

// Unwrap the the Values

for (const val of Object.values(equine)) {
    console.log(val);
}

// Create a Map
const equine = new Map(Object.entries(equine));

for (const v of equine.values()) {
    console.log(v)
}
{{< /highlight >}}

### Destructuring in a Loop

When looping over an array of arrays, it can be be useful to desctructure the values directly in the loop. This allows us to write more expressive code without any extra lines. 

{{< highlight javascript >}}
const equine = [
    ['horse', '🐴'],
    ['zebra', '🦓'],
    ['unicorn', '🦄']
];

// 😒 Meh Code
for (const arr of equine) {
    const type = arr[0];
    const face = arr[1];
    console.log(`${type} looks like ${face}`);
}

// 🤯 Destructured Code
for (const [type, face] of equine) {
    console.log(`${type} looks like ${face}`);
}
{{< /highlight >}}

### Implementing your Own Iterator

{{< box icon="scroll" class="box-blue" >}}
An *iterator* is a Function that defines how a loop works. An *iterable* is something you can loop over (or call the iterator function on), like an Array. 
{{< /box >}}

So how does the `for-of` loop really work? Well it's actually just an [iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators) function. In fact, we can override the behavior of the loop by implementing our own from scratch. In this case, we append an emoji 🙈 to each element in the loop just because we can. 

{{< highlight javascript >}}
arr[Symbol.iterator] = function() {
  let i = 0;
  let arr = this;
  return {
    next: function() {
      if (i >= arr.length) {
        return { done: true };
      } else {
        const value = arr[i] + '🙈';
        i++;
        return { value, done: false };
      }
    }
  };
};
{{< /highlight >}}

## Functional Composition

Modern JavaScript provides a smorgasbord of precooked methods for working with Arrays. Let's leverage functional composition to reduce the lines of code needed in our apps. Below is a showcase of some of my favorite Array methods. 

{{< file "js" "fun.js" >}}
{{< highlight javascript >}}
const faces = ['😀', '😍', '🤤', '🤯', '💩', '🤠', '🥳'];

// Transform values
const withIndex = faces.map((v, i) => `face ${i} is ${v}`);

// Test at least one value meets a condition
const isPoopy = faces.some(v => v === '💩')
// false

// Test all values meet a condition
const isEmoji = faces.every(v => v > 'ÿ');
// true


// Filter out values
const withoutPoo = faces.filter(v => v !== '💩')

// Reduce values to a single value
const pooCount = faces.reduce((acc, cur) => {
    return acc + (cur === '💩' ? 1 : 0)
}, 0);
console.log(pooCount)

// Sort the values
const sorted = faces.sort((a, b) => a < b);
{{< /highlight >}}
