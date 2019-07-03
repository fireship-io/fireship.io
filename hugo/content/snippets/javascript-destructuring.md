---
title: JavaScript Destructuring Pro Tips
publishdate: 2019-01-07T09:35:09-07:00
lastmod: 2019-01-07T09:35:09-07:00
draft: false
type: lessons
author: Jeff Delaney
description: Use destructuring assignment in JavaScript to make your code concise and readable
tags: 
    - javascript
    - typescript
---


[Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) assignment is technique available in modern JavaScript and TypeScript that allows you to extract the values from an Object or Array, then assign them as variables. It can significantly improve the readability of your code in the right situation, so let's take a look at scenarios where destructuring can save us a few lines of code. 

## Objects

Let's imagine we have a big giant JSON response from an API, but only need a handful of its properties. Notice how we repeatedly call `res.<somthing>` - this can get ugly. 


{{< file "js" "object.js" >}}
{{< highlight javascript >}}
const res = fetchBlogPost();

// 😒 Meh Code
const user = res.user;
const title = res.title;
const body = res.text;

// 🤯 Destructured Code
const { user, title, text } = res;
{{< /highlight >}}

You can also use it with async/await. 

{{< highlight javascript >}}
async () => {
  const { user, text, title, date } = await fetchBlogPost();
}
{{< /highlight >}}

And it comes in handy when using *console.log* because you can clearly name what you are logging. 

{{< highlight javascript >}}
// 😒 Meh Code
console.log(widget, component)

// 🤯 Destructured Code
console.log({ widget, component })
{{< /highlight >}}

{{< figure src="/img/snippets/destructuring-log1.png" alt="console log with destructuring" >}}


## Function Arguments

Function arguments can also be destructured, which is especially useful when you have a large number of optional named arguments. 

{{< file "js" "function.js" >}}
{{< highlight javascript >}}
// 😒 Meh Code
function bmi(person) {
    const height = person.height;
    const weight = person.weight;

    return weight / height;
}
// 🤯 Destructured Code
function bmi({ height, weight }) {
    return weight / height;
}

// Both are called the same way
bmi(person);
{{< /highlight >}}


## Arrays and Loops

Array destructuring is especially useful when you have an array where each position represents something meaningful. This data structure is similar to a [tuple](https://www.w3schools.com/python/python_tuples.asp) as in other languages like Python. 


{{< file "js" "array.js" >}}
{{< highlight javascript >}}
const arr = ['jeff', 'delaney', 'js'];

// 😒 Meh Code
const first = arr[0];
const last = arr[1];
const lang = arr[2];

// 🤯 Destructured Code
const [first, middle, lang] = arr;
{{< /highlight >}}

It is most powerful when you have a 2D array, or array-of-arrays. You can destructure the array positions while looping over the elements to write clean and readable code.

{{< file "js" "loop.js" >}}
{{< highlight javascript >}}
const peeps = [
    ['guido', 'van rossum', 'python'],
    ['brendan', 'eich', 'rust'],
];

for (const [first, middle, lang] of peeps) {
    console.log('hello ' + first);
}
{{< /highlight >}}

More common than a 2D array is an array of objects. You can also loop over the key-value pairs in the object and destructure them along the way. 

{{< highlight javascript >}}
const animals = [
    { type: 'dog', name: '🐺 fido' },
    { type: 'cat', name: '🐱 snowball' }
];


for (const { name, type } of animals) {
    console.log(name, type);
}
{{< /highlight >}}


You can even destructure nested properties on complex objects. In this case, each object has a `friends` Array and nested `profile` object. How do we assign values on the nested properties to variable names? 

{{< highlight javascript >}}
const animals = [
    { 
        type: '🐺 dog', 
        name: 'fido', 
        friends: ['rex', 'todd', 'bob'], 
        profile: { 
            color: 'brown',
            weight: 23 
        } 
    },
    { 
        type: '🐱 cat', 
        name: 'snowball', 
        friends: [ 'fido' ], 
        profile: { 
            color: 'white',
            weight: 7
        } 
    }
];


for (const { name, type, friends: [best], profile: { color } } of animals) {
    const bio = `${name} is a ${color} ${type} and his best friend is ${best}`
    console.log(bio);
}
{{< /highlight >}}

{{< figure src="/img/snippets/destructuring-console-log.png" alt="complex loop destructuring assignment" >}}
