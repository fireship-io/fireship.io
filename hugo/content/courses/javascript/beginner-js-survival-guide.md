---
title: The JavaScript Survival Guide
lastmod: 2019-04-16T09:12:30-08:00
draft: false
description: A quick primer for advanced JavaScript concepts like primitives, hoisting, closures, and this binding. 
weight: 4
emoji: 🧟
free: true
---

{{< youtube 9emXNzqCKyg >}}

The *JavaScript Survival Guide* is a primer for the so-called "weird" features of the language. These concepts are common pain-points for developers, but they become relatively simple when you understand relationship between your code and the JS engine. Not to mention, these topics come up frequently on JS interviews. 

All research this section is based on the guidance from [Mozilla](https://developer.mozilla.org) - the holy grail of JS documentation. 


## Primitive vs Object

The lowest level building blocks in JavaScript are [primitives](https://developer.mozilla.org/en-US/docs/Glossary/Primitive), which include: undefined, null, string, number, bigint, boolean, and symbol. All primitives are immutable. 

Anything that is not a primitive is an [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), or a descendant of it. Objects are collections of key/value pairs and used as the building block for more complex data structures. Here are a few examples:


{{< file "js" "index.js" >}}
{{< highlight javascript >}}
typeof  23; // number
typeof "foo" // string
typeof null // null

typeof {} // object
typeof [] // object
typeof function() {} // function (which inherits from object)
{{< /highlight >}}

## Truthy vs Falsy

When a value is encounted in a *Boolean* context - such as an `if` statement - it will be coerced into a boolean. If the result is `true` then the value is *truthy* and vice versa. If you're unsure about a value, you can convert it using the logical `!` NOT operator twice, or a double-bang as I like to call it `!!`. 


{{< file "js" "index.js" >}}
{{< highlight javascript >}}
true; // true
!! "hello"; // true
!! -1; // true
!! []; // true
!! {}; // true

false; // false
!! null; // false
!! undefined; // false
!! 0; // false
!! ""; // false

{{< /highlight >}}

## Hoisting

[Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting) means that your declarations, i.e. functions and variables, will always be placed in memory at the top of the execution context. 

Notice how the function below can be called before it's actually declared. That's hoisting in action. 

{{< file "js" "index.js" >}}
{{< highlight javascript >}}

// hoisting is as if your `function fun() {}` was located here. 

fun(); // works. 

function fun() {}
{{< /highlight >}}

## Closures

What is a [Closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)? Here's a quick and simple definition that makes sense to me (although "lexical environment" would be a more accurate than function): 

> A function within a function, where the outer function's local variables remain available in memory after creation. 

If you come from an classical OOP background, you may notice how closure is very similar to a class instance with properties and methods. 

Notice how `outer` contains a local number variable, while `inner` increments it. Even though outer is only called once, we can still access the count because JS "closes over" the inner function to preserve the execution context. 

{{< file "js" "closure.js" >}}
{{< highlight javascript >}}
function outer() {

    let count = 0; // persits in memory after outer is popped off the call stack

    function inner() {
        count++;
        return count;
    }

    return inner;
}

// Creates the Closure
const addOne = outer();

// Operates within its context or lexical environment
addOne(); // 1
addOne(); // 2
addOne(); // 3
{{< /highlight >}}


