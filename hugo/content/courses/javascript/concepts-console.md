---
title: The Console
lastmod: 2020-02-18T09:12:30-08:00
draft: false
description: Go beyond console.log() like and debug like a pro 
weight: 8
emoji: 🧐
free: true
chapter_start: Useful JS Concepts to Know
featured_img: courses/javascript/img/console-featured.png
---

{{< youtube L8CDt1J3DAw >}}

At this point in your JS career, you likely know what `console.log` does - but the [Console](https://developers.google.com/web/tools/chrome-devtools/console) API can do so much more! It can be an effective debugging tool, but it can also be nightmare when abused. Let's take a look at some tricks that will keep your console output concise and beautiful. Open the console on your browser by running <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>J</kbd> to get started with this section. 

First, inspect the methods on the console that go beyond `log`, by running: 

```javascript
console.log( console );
```

This article is focused on frontend browser JS, but the [Node Console API](https://nodejs.org/api/console.html) is almost identical. 

## Console FAQ

<div class="insta">

</div>

### How to show variable names when console logging?

It is easy for variable names to get jumbled-up when you have tons of output to the console. Wrap your variables in braces `{}` to make them an object, or brackets `[]` to make them an array, then use `console.table` to make them pretty. 

```javascript
💩console.log(bar, foo);

// Wait, which variable is named foo? 

😐 console.log({ foo, bar });

// Better, but it's kinda hard to read...

😍console.table({ foo, bar });

// Noice!
```

{{< figure src="/courses/javascript/img/console-table.png" caption="Output of console.table()" >}}

### How to group console logs?

You might not care about every line outputted into the console. Remove the clutter by grouping logs into a collapsible section with `group` or `groupCollapsed`. 

```javascript
console.group();

console.log(1);
console.log(2);
console.log(3);

console.groupEnd();
```

### How to conditionally console log?

Sometimes you want to log ONLY when a condition is falsey - this is known as an assertion. It will keep your code concise by eliminating the need for `if` statements. 

```javascript
// verbose 💩
if (loggedIn) {
    console.error('user is logged in assertion failed');
}

// much better 😍 
console.assert(loggedIn, 'user is logged in');
```

{{< figure src="/courses/javascript/img/console-assert.png" caption="Output of console.assert()" >}}


### How to increment a counter in the console?

Keeping a counter running in your source code means managing mutable state - you probably don't want that extra complexity. Instead, use `count` to tell the browser to increment a counter for you. 

```javascript
console.count();
console.count();
console.count();

console.countReset(); // reset to zero
```

{{< figure src="/courses/javascript/img/console-count.png" caption="Output of console.count()" >}}


### How to set a timer with the console?

You can start a timer with the console by calling `time`, then call `timeLog` to measure the elapsed time. It provides a simple solution for measuring performance. 

```js
console.time();

// do stuff

console.timeLog('did stuff');


// do more stuff

console.timeLog('did more stuff');

console.timeEnd()
```

### How to add custom CSS styles to the console output?

Use the special `%c` character to add some [custom CSS](https://stackoverflow.com/questions/7505623/colors-in-javascript-console) flavor to the console. This is a surefire way to impress other developers, especially if you maintain an open source library. 

```javascript
console.log('%c YOUR_MESSAGE', 'YOUR_CSS')
```

{{< figure src="/courses/javascript/img/console-style.png" caption="Custom CSS styles in browser console" >}}



