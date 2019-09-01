---
title: Objects
lastmod: 2019-04-16T09:12:30-08:00
draft: false
description: All about JS Objects
weight: 6
emoji: 📓
free: true
---

The JavaScript object is an array of key-value pairs, similar to a map, dictionary, or hash table in other programming languages. 

- An **Object** is a collection of properties.
- A **Property** is a key-value pair that contains a name and a value. 
- A **Property Name** is a unique value that can be coreced to a string that points to a value. 
- A **Property Value** can be any value, including other objects or functions, that associated with the name/key. 

{{< figure src="/courses/javascript/img/js-object-props.png" alt="An object is a collection of properties, aka key-value pairs" >}}

## Object Basics

### Empty Object

Create an an empty object. 

{{< file "js" "objects.js" >}}
{{< highlight javascript >}}
// literal
const dog = { }

// constructor
const cat = new Object();
{{< /highlight >}}

### Get and Set Properties

Now that we have an empty object, we need to add properties to it using [accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors). 

Valid property names include anything that can be coerced to a string, but must not used reserved words like `function`, `var`, `return` and so on. 

{{< highlight javascript >}}
get = object.property;
object.property = set;
{{< /highlight >}}


A potential gotcha with dot notation is that you can only access names that follow variable name [identifier](https://developer.mozilla.org/en-US/docs/Glossary/identifier) conventions, i.e without spaces or that do not start with a digit.

{{< highlight javascript >}}
obj['hi mom'] = 1;
obj[23] = 1;

// syntax errors
obj.hi mom
obj.23
{{< /highlight >}}

In modern JS, we have a convenient shorthand for setting properties

{{< highlight javascript >}}
const hello = 1;
const world = 1;

// Old way 💩
const obj = {
    hello: hello,
    world: world
}

// Modern way 👍
const obj = {
    hello,
    world,
}
{{< /highlight >}}

And lastly, object properties can be removed with the `delete` keyword. 

{{< highlight javascript >}}
delete obj.hello;
delete obj.world;
{{< /highlight >}}

### Useful Object Methods

## References

A special characteristic of an object is that that is variables maintain a *reference* to it, as opposed to a full copy of it. When checking for object equality, it checks the reference, or the actual value of properties.

{{< highlight javascript >}}
const original = { }

const x = original;
const y = original;

x === y; // true
x === {}; // false
{{< /highlight >}}

This means that any variable that points to that reference can set its properties and they will be shared between all variables. 

{{< highlight javascript >}}
x.hello = 'world';

original.hello; // world
y.hello; // world
{{< /highlight >}}

## Combining Objects

But what if we want to clone an object? `Object.assign` allows us to copy an object's properties and create a new reference. This means that changes to the original will not affect the clone. 

{{< highlight javascript >}}
const original = {
    hello: 'world'
 }

const clone = Object.assign({ }, original);

clone === original; // false

original.hello = 'changed!';

clone.hello; // world (did not change)
{{< /highlight >}}

### Spread Syntax

Often a better alternative to Object.assign is the spread syntax.

{{< highlight javascript >}}
const clone = Object.assign({ }, original);

const sugar = { ...original };

const sugar = { ...original, hola: 'mundo' }; 
{{< /highlight >}}

## Object Methods

When a function is assigned to an object, it is called a *method*. 

### Shorthand

{{< highlight javascript >}}
const obj = {
  hello() {
	console.log('yo')
  }
}

obj.hello();
{{< /highlight >}}


### This

{{< highlight javascript >}}
const obj = {
  username: 'Jeff',
  hello() {
	console.log(`My name is ${this.username}`)
  }
}

obj.hello(); // My name is Jeff
{{< /highlight >}}

### Arrow

Functions using the arrow syntax are not bound to `this`, which means

{{< highlight javascript >}}
const obj = {
  username: 'Jeff',
  hello: () => console.log(this.username)
}

obj.hello(); // My name is undefined
{{< /highlight >}}

### Chaining

In certain JS libraries you will see method chaining with `obj.doThis().toThat()`, which is made possible by simply returning the value of *this* from each method. 

{{< file "js" "jquery.js" >}}
{{< highlight javascript >}}
const game = {
  hitpoints: 100,
  log() {
    console.log(`👾 ${this.hitpoints}`);
  },
  takeDamage() {
    this.hitpoints -= 10;
    this.log();
    return this; // Required for chaining
  },
  heal() {
    this.hitpoints += 10;
    this.log();
    return this; // Required for chaining
  },
}

game.takeDamage().takeDamage().takeDamage().heal();

👾 90
👾 80
👾 70
👾 80
{{< /highlight >}}

