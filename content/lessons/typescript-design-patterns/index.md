---
title: 10 Design Patterns in TypeScript
lastmod: 2022-03-13T14:42:50-07:00
publishdate: 2022-03-13T14:42:50-07:00
author: Jeff Delaney
draft: false
description: A breakdown 10 software design patterns in TypeScript.
tags: 
    - typescript

youtube: tv-_1er1mWI
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

[Design patterns](https://en.wikipedia.org/wiki/Design_Patterns) is a highly influential book published in 1994 by four computer scientists called the *Gang of Four*. It was originally aimed at C++ developers, but has since become a book for anyone interested in object-oriented software design.

In the following lesson, we will look at 10 different patterns from this book with simplified modern examples in TypeScript. For additional patterns and examples, check out [Refactoring Guru](https://refactoring.guru). 

## Creational

Creational patterns are related to the creation of new objects.

### Singleton

A singleton is an object that can only be instantiated once. It is useful fo implementing a global object that can be accessed from anywhere in the application.

{{< file "ts" "software.ts" >}}
```typescript
class Settings {

  static instance: Settings;
  public readonly mode = 'dark';

  // prevent new with private constructor
  private constructor() {

  }

  static getInstance(): Settings {
    if (!Settings.instance) {
      Settings.instance = new Settings();
    }

    return Settings.instance;
  }

}

const settings = new Settings() // throws error
const settings = Settings.getInstance();
```

### Prototype

Prototype allows objects to be clones of other objects, rather then extended via inheritance.

{{< file "ts" "software.ts" >}}
```typescript
const zombie = {
  eatBrains() {
    return 'yum 🧠';
  }
}

const chad = Object.create(zombie, { name: { value: 'chad'} });

chad.__proto__;
Object.getPrototypeOf(chad);

const babyChad = Object.create(chad, { baby: { value: true } });

```
### Factory

A factory is a method or function that creates an object, or a set of objects, without exposing the creation logic to the client.

{{< file "ts" "software.ts" >}}
```typescript
class IOSButton { }

class AndroidButton { }

// Without Factory
const button1 = os === 'ios' ? new IOSButton() : new AndroidButton()
const button2 = os === 'ios' ? new IOSButton() : new AndroidButton()

class ButtonFactory {
  createButton(os: string): IOSButton | AndroidButton {
    if (os === 'ios') {
      return new IOSButton();
    } else {
      return new AndroidButton();
    }
  }
}

// With Factory
const factory = new ButtonFactory();
const btn1 = factory.createButton(os);
const btn2 = factory.createButton(os);
```
### Builder

The builder pattern is a creational design pattern that lets you construct complex objects step by step. It JavaScript, we can achieve this with method chaining. 

{{< file "ts" "software.ts" >}}
```typescript
class HotDog {
  constructor(
    public bread: string,
    public ketchup?: boolean,
    public mustard?: boolean,
    public kraut?: boolean
  ) {}

  addKetchup() {
    this.ketchup = true;
    return this;
  }
  addMustard() {
    this.mustard = true;
    return this;
  }
  addKraut() {
    this.kraut = true;
    return this;
  }
}

const myLunch = new HotDog('gluten free')
  .addKetchup()
  .addMustard()
  .addKraut();
```
## Structural

Structural patterns are primarily used to handle relationships between objects.

### Facade

A facade is a class that provides a simplified API for larger body of code. It is often to used to hide low-level details of a subsystem.

{{< file "ts" "software.ts" >}}
```typescript
class PlumbingSystem {
  // low evel access to plubming system
  setPressure(v: number) {}
  turnOn() {}
  turnOff() {}
}

class ElectricalSystem {
  // low evel access to electrical system
  setVoltage(v: number) {}
  turnOn() {}
  turnOff() {}
}

class House {

  private plumbing = new PlumbingSystem();
  private electrical = new ElectricalSystem();

  public turnOnSystems() {
    this.electrical.setVoltage(120);
    this.electrical.turnOn();
    this.plumbing.setPressure(500);
    this.plumbing.turnOn();
  }

  public shutDown() {
    this.plumbing.turnOff();
    this.electrical.turnOff();
  }

}

const client = new House();
client.turnOnSystems();
client.shutDown();
```
### Proxy

The proxy pattern lets you provide a substitute or placeholder for another object to control access to it. For example, [VueJS uses a Proxy](https://vuejs.org/guide/extras/reactivity-in-depth.html#how-reactivity-works-in-vu) to intercept and modify data on objects. 

{{< file "ts" "software.ts" >}}
```typescript
const original = { name: 'jeff' };

const reactive = new Proxy(original, {
  get(target, key) {
    console.log('Tracking: ', key);
    return target[key];
  },
  set(target, key, value) {
    console.log('updating UI...');
    return Reflect.set(target, key, value);
  },
});

reactive.name; // 'Tracking: name'

reactive.name = 'bob'; // 'updating UI...'
```

## Behavioral

Behavioral patterns are used to identify communication between objects.

### Iterator

The iterator pattern is used to traverse a collection of elements. Most programming languages provide abstrations for iteration like the `for` loop. However, you can create your own iterators in JavaScript by using the `Symbol.iterator` property. The code below creates a custom range function that can be used in a regular `for` loop. 

{{< file "ts" "software.ts" >}}
```typescript
function range(start: number, end: number, step=1) {
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      if (start < end) {
        start = start+step;
        return { value: start, done: false };
      }
      return { done: true, value: end }; 
    }
  }
}

for (const n of range(0, 100, 5)) {
  console.log(n);   
}

```
### Observer

The observer pattern is used to notify a set of interested parties when a state change occurs. The [rxjs]() library is a popular implementation of this pattern.

{{< file "ts" "software.ts" >}}
```typescript
import { Subject } from 'rxjs';

const news = new Subject();

const tv1 = news.subscribe(v => console.log(v + 'via Den TV'));
const tv2 = news.subscribe(v => console.log(v + 'via Batcave TV'));
const tv3 = news.subscribe(v => console.log(v + 'via Airport TV'));

news.next('Breaking news: ');
news.next('The war is over ');

tv1.unsubscribe();
```
### Mediator

The mediator is provids a middle layer between objects that communicate with each other. This pattern implemented frequently in JavaScript libaries via plugin systems (like Webpack) and middleware (like Express).

{{< file "ts" "software.ts" >}}
```typescript
import express from 'express';
const app = express();

// Middleware logic
function mediator(req, res, next) {
  console.log('Request Type:', req.method)
  next()
}

app.use(mediator);

// Mediator runs before each route handler
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/about', (req, res) => {
  res.send('About');
});

```
### State

The state pattern is used to encapsulate the state of an object so that it can be changed and accessed independently of the object. In JavaScript, finite state machines are sometimes used to maintain a predictable flow of data in an application via libraries like [XState](https://xstate.js.org/).

{{< file "ts" "software.ts" >}}
```typescript
interface State {
  think(): string;
}

class HappyState implements State {
  think() {
    return 'I am happy 🙂';
  }
}

class SadState implements State {
  think() {
    return 'I am sad 🙁';
  }
}


class Human {
  state: State;

  constructor() {
    this.state = new HappyState();
  }

  changeState(state) {
    this.state = state;
  }

  think() {
    return this.state.think();
  }
  
}

const human = new Human();
console.log(human.think());
human.changeState(new SadState());
console.log(human.think());
```
