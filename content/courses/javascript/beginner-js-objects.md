---
title: Objects
lastmod: 2019-04-16T09:12:30-08:00
draft: false
description: Everything you need to know about the JavaScript Object
weight: 6
emoji: 🧱
free: true
youtube: napDjGFjHR0
---

The JavaScript object is a collection of key-value pairs, similar to a map, dictionary, or hash-table in other programming languages. Anything that is not a JS primitive is an Object.

- An **Object** is a collection of properties.
- A **Property** is a key-value pair that contains a name and a value. 
- A **Property Name** is a unique value that can be coerced to a string that points to a value. 
- A **Property Value** can be any value, including other objects or functions, that associated with the name/key. 

{{< figure src="/courses/javascript/img/js-object-props.png" alt="An object is a collection of properties, aka key-value pairs" >}}

## Object Basics

### Creation

Create an empty object. You have several options. 

{{< file "js" "objects.js" >}}
```js
// literal
const dog = { }

// constructor
const cat = new Object();

// static method
const horse = Object.create({ })
```

### Get and Set Properties

Now that we have an empty object, we need to add properties to it using [accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors). 

Valid property names include anything that can be coerced to a string, but must not used reserved words like `function`, `var`, `return` and so on. 

```js
get = object.property;
object.property = set;
```


A potential gotcha with dot notation is that you can only access names that follow variable name [identifier](https://developer.mozilla.org/en-US/docs/Glossary/identifier) conventions, i.e without spaces or that do not start with a digit.

```js
obj['hi mom'] = 1;
obj[23] = 1;

// syntax errors
obj.hi mom
obj.23
```

Since ES6, we have a convenient shorthand for setting properties:

```js
let hello;
let world;

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
```

Use a variable or expression as a property name by wrapping it in brackets - this is called a computed property. 

```js
const x = 'howdy';

const obj = {
  [x]: 23
}

obj.howdy // 23
```

Object properties can be removed with the `delete` keyword. 

```js
delete obj.hello;
delete obj.world;
```

## References

An object is stored in the [heap](https://developers.google.com/web/tools/chrome-devtools/memory-problems/memory-101) memory, which means variables maintain a *reference* to it, as opposed to a full copy of it. When checking for object equality, it checks the reference - not the actual value of properties.

```js
const original = { }

const x = original;
const y = original;

x === y; // true
x === {}; // false
```

Any variable that points to that reference can set its properties and they will be shared between all variables. 

```js
x.hello = 'world';

original.hello; // world
y.hello; // world
```

## Combine Objects

But what if we want to clone an object to create a separate reference? `Object.assign` allows us to copy an object's properties and create a new reference. Its properties will be copied to the new object, thus changes to the original object will not affect the clone. 

```js
const original = {
    hello: 'world'
 }

const clone = Object.assign({ }, original);

clone === original; // false

original.hello = 'changed!';

clone.hello; // world (did not change)
```

### Spread Syntax

A more concise alternative to `Object.assign` is the spread syntax.

```js
const clone = Object.assign({ }, original);

const sugar = { ...original };

const sugar = { ...original, hola: 'mundo' }; 
```

## Object Methods

When a function is assigned to an object, it is called a *method*. 

### Shorthand

```js
const obj = {
  hello() {
	  console.log('yo')
  }
}

obj.hello();
```


### This

In a normal method, `this` refers to the object on which it is defined.

```js
const obj = {
  username: 'Jeff',
  hello() {
	console.log(`My name is ${this.username}`)
  }
}

obj.hello(); // My name is Jeff
```

### Arrow

Functions using the arrow syntax are not bound to `this`, so it refers to the outer or global `this` context. 

```js
const obj = {
  username: 'Jeff',
  hello: () => console.log(this.username)
}

obj.hello(); // My name is undefined
```

### Chaining

In certain JS libraries you will see method chaining with `obj.doThis().toThat()`, which is made possible by simply returning the value of *this* from each method. 

{{< file "js" "jquery.js" >}}
```js
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
```

## Constructors

Constructors are just functions that describe how to create an Object. 

```js
function Boat(name) {
  this.name = name;
  this.created = Date.now()

  this.horn = function () {
    console.log(this.name)
  }
}
```

The object is then instantiated with the `new` keyword. 

```js
const sally = new Boat('Sally');
const molly = new Boat('Molly');

sally.horn() // Sally
```
