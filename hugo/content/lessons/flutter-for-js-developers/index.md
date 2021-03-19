---
title: Flutter for JavaScript Developers
lastmod: 2019-01-20T12:28:17-07:00
publishdate: 2019-01-20T12:28:17-07:00
author: Jeff Delaney
draft: false
description: A guide to Dart and Flutter for JavaScript Developers who have experience with React Native and Ionic
tags: 
    - dart
    - flutter
    - javascript
    - typescript

youtube: 7sJZi0grFR4
github: https://gist.github.com/codediodeio/8d59623a3ccac79e9168122b21c4a766
# disable_toc: true
# disable_qna: true

# courses
# step: 0

versions:
   flutter: 1.0
   dart: 2
---

So you're a web developer working with JavaScript and curious about [Flutter](https://flutter.io/docs/get-started/flutter-for/web-devs)? That was me about one-year ago, and at the time, learning an uncommon language like Dart seemed ridiculous because there are existing hybrid app frameworks in JS. Then I tried it... To my surprise, I was able to write productive code right out of the gate. The following lesson will compare Dart/Flutter to JS/ReactNative. 

{{< figure src="img/js-dart-reddit.png" alt="Post comparing Dart and JS from reddit" >}}
Source: [FlutterDev subreddit](https://www.reddit.com/r/FlutterDev/comments/92d995/what_do_you_like_or_not_like_about_the_dart/)


{{< box icon="scroll" class="" >}}
Throughout this lesson, you will see the 👉 emoji. Dart will always be on the left, and JS on the right. These are not always perfect 1-to-1 comparisons, but you get the idea. 
{{< /box >}}

## The Tradeoffs

> There are no solutions; there are only trade-offs. - Thomas Sowell

### Flutter is awesome 🐦🤟 because it...

- has amazing docs & tooling
- performs faster because it has no JavaScript bridge
- can integrate native code
- hot reloads
- small code footprint and no import/export/bundling headaches
- it positions you for future development with [Fuchsia](https://en.wikipedia.org/wiki/Google_Fuchsia)

### Flutter is meh 😒 because it...

- has a steeper learning curve with Dart
- cannot be debugged in the browser 
- has a small ecosystem of developers and plugins relative to JS

## Dart vs JS - Syntax

Dart is a strongly-typed compiled language, while JS is a weakly-typed scripting language. Despite being polar opposites in these ways, they share many of the same convetions, so most JS devs will be productive on day one. 

{{< box icon="dart" class="box-green" >}}
Want to write some Dart code right now? Head over to the [DartPad](https://dartpad.dartlang.org/) playground.
{{< /box >}}

### Variables

- `SomeType foo;` 👉 `let foo`
- `final` 👉 `const`
- `const` 👉 `Object.freeze(obj)`



{{< file "typescript" "index.ts" >}} {{< highlight typescript >}}
// Reassignable variables
let person: string;
person = 'jeff';
person = 'bob';

// Single assignment variables
const lucky: number = 23;

// Implicit
const implicit = { name: 'Jeff' }; 

// Any
const whoKnows: any = getSomethingDynamic();
{{< /highlight >}}

{{< file "dart" "main.dart" >}} {{< highlight dart >}}
// Reassignable variables
String person;
person = 'Jeff';
person = 'Bob';

// Single Assignment
final int lucky = 23;

// Single Assignment & Immutable
const Map person = 'Jeff';

// Implicit
var implicit = { 'name': 'Jeff' }; // Map<String, String>

// Any type
dynamic whoKnows = getSomethingDynamic();
{{< /highlight >}}

### Imports/Exports

In JS, you have several ways to import/export values, so let's just look at the modern ES6 way. 


{{< file "typescript" "globals.ts" >}} {{< highlight typescript >}}
export default const = 'JS';
// or
export const lang = 'JS';
{{< /highlight >}}

{{< file "typescript" "index.ts" >}} {{< highlight typescript >}}
import lang from 'globals';
// or
import { lang } from 'globals';
{{< /highlight >}}

When you import a file in Dart, you will have access to everything declared that file. It looks trivial here, but it eliminates the **import hell 😠** that you find in basically every big JS project. 

{{< file "dart" "globals.dart" >}} {{< highlight dart >}}
final String lang = 'Dart!';
{{< /highlight >}}

{{< file "dart" "main.dart" >}} {{< highlight dart >}}
import 'globals.dart';

main() {
  print(lang)
}
{{< /highlight >}}

### Logging

{{< file "typescript" "index.ts" >}} {{< highlight typescript >}}
console.log('howdy!');
{{< /highlight >}}

{{< file "dart" "main.dart" >}} {{< highlight dart >}}
print('howdy!');
{{< /highlight >}}

### Entry Point

JS doesn't have a required entry point to start executing our code, but it's common to export a function. 

{{< file "typescript" "index.ts" >}} {{< highlight typescript >}}
export const app = () => {
    // init app
};

app();
{{< /highlight >}}

In dart, a main function is required. 

{{< file "dart" "main.dart" >}} {{< highlight dart >}}
main() {

}
{{< /highlight >}}

### Maps and Objects

- Map 👉 cross between Object and Map

Dart has a [Map](https://www.dartlang.org/guides/language/language-tour#maps) class used to represent key-value pairs. It combines some of the features from in the JS `Object` & `Map`. 

{{< file "typescript" "index.ts" >}} {{< highlight typescript >}}
const state = { lucky: 23 }
state['unlucky'] = 11;

const state = new Map([['lucky', 23]]);
state.set('unlucky', 11);
{{< /highlight >}}

{{< file "dart" "main.dart" >}} {{< highlight dart >}}
Map state = { 'lucky': 23 };
state['unlucky'] = 11;
{{< /highlight >}}

### Lists and Arrays

- List 👉 Array

A Dart [List](https://www.dartlang.org/guides/language/language-tour#lists) is similar to a JS Array, containing most of the same instance and class methods (and beyond).

{{< file "typescript" "index.ts" >}} {{< highlight typescript >}}
const things: number[] = [1, 2, 3]
{{< /highlight >}}

{{< file "dart" "main.dart" >}} {{< highlight dart >}}
List<int> things = [1, 2, 3];

things.forEach()
things.reduce()
things.last;
{{< /highlight >}}


### Functions

Functions in Dart should feel very familiar to the JS dev - it supports named, anonymous, arrow, and higher-order functions. The main difference is that you don't need the `function` keyword.  

{{< file "typescript" "index.ts" >}} {{< highlight typescript >}}
function addOne(val: number) {
    return val + 1;
}

// Higher Order
function callme(cb: Function) {
    return cb('Hello?');
}

callme((v) => console.log(v));
{{< /highlight >}}

{{< file "dart" "main.dart" >}} {{< highlight dart >}}
addOne(int val) {
    return val + 1;
} 

// Higher Order
callme(Function cb) {
    return cb('Hello?');
}

callme((v) => print(v));
{{< /highlight >}}

### Classes

You will be using [Classes](https://www.dartlang.org/guides/language/language-tour#classes) frequently in Dart and they are very powerful. The language supports **mixin-based inheritance**, which provides excellent code reuse with [composition](https://en.wikipedia.org/wiki/Composition_over_inheritance). In JS, classes are just syntatic sugar for functions and prototypal inheritance.


{{< file "typescript" "index.ts" >}} {{< highlight typescript >}}
export const main = () => {
    const myComponent = new Component()
}

class Component { }
{{< /highlight >}}

Defining and instantiating a class is nearly identical, but Dart does not require the `new` keyword. 

{{< file "dart" "main.dart" >}} {{< highlight dart >}}
main() {
  var myWidget = Widget();
}

class Widget { }
{{< /highlight >}}

### Class Constructors

In Dart, you can construct a class by calling its name like a Function. In addition, you can use **named constructors** to instantiate the same with different logic.

{{< file "typescript" "index.ts" >}} {{< highlight typescript >}}
export const main = () => {
    const bar = new Component(1,2);
}

class Component { 
    constructor(private a, public b) {
        // non-ts version
        // this.a = a
        // this.b = b
    }
}
{{< /highlight >}}

{{< box icon="scroll" class="box-blue" >}}
Starting any variable or property with `_` in Dart will make it private to its library or class. 
{{< /box >}}

{{< file "dart" "main.dart" >}} {{< highlight dart >}}
main() {
  Widget foo = Widget.withStrings('1', '2');
}

class Widget { 

  // Default Constructor
  Widget(_a, b);

  // Named Constructor
  Widget.withStrings(_a, b);
  
}
{{< /highlight >}}

## Async Programming


### Futures and Promises

- Future 👉 Promise

A Dart `Future` is almost identical to a JS `Promise`, which is really nice because this is one of the more complex concepts master. 

{{< file "typescript" "index.ts" >}} {{< highlight typescript >}}
async function howdy() {
    return 'partner 🤠';
}

async function greet() {
    await howdy();
}

greet().then(console.log).catch()
{{< /highlight >}}

{{< file "dart" "main.dart" >}} {{< highlight dart >}}
Future howdy() async {
    return 'partner 🤠';
}

greet() async {
    await howdy();
}

greet().then(print).catchError();
{{< /highlight >}}

### Streams and Observables

- Stream 👉 Observable

JavaScript does not have a *native* stream-like data structure [yet](https://github.com/tc39/proposal-observable), but they are commonly provided via supporting packages like RxJS, Mobx, and others. A stream is similar to a Promise (Future), except that is 

A `Stream` is like a Future that emits multiple values over time and we can even use it with async/await 😍.

{{< file "dart" "main.dart" >}} {{< highlight dart >}}
main() async {

  var items = Stream.fromIterable([1,2,3]);

  await for (int i in items) {
    // do something 
  }

  // Or setup a listener
  items.listen(print);
}
{{< /highlight >}}

There is one big concept to keep in mind, single subscription streams (default) will throw an error if multiple subscribers try to listen. 

- Single-subscription streams 👉 Cold observable
- Broadcast streams 👉 Hot Observable

Even though streams are available in Dart, I often find myself using [RxDart](https://pub.dartlang.org/packages/rxdart) in Flutter. The beauty of RxDart is that it builds on top of streams, rather than try to reinvent the wheel, so anything that uses a stream in Flutter can also use an Rx observable. Also, if you're coming from the Angular world you can keep the operators you know and love like `switchMap`, `takeUntil`, `scan`, and so on. 


## Flutter vs Frameworks

Flutter is inspired by JavaScript frameworks like React/Angular/Vue that enable components to reactively update the UI when data changes. In fact, Flutter provides a `setState` method that works exactly like it does in [ReactJS](https://reactjs.org/docs/react-component.html#setstate).

Overall, it is not very opinionated about how architect the app. You can use composition to build a bunch of tiny widgets in their own files, or create a few big widgets in a single file.  

### Dependency Management

- pubspec.yaml 👉 package.json
- [Pub](https://pub.dartlang.org/)  👉 [NPM](https://www.npmjs.com/)

Dependencies are registered in the **pubspec.yaml** and should auto-update on save. 

### Widgets and Components

- Widget 👉  Component
- `build` 👉 `render`

As you may have guessed, Flutter has components similar to those in React, with a build method that can be called when state changes. 

{{< file "typescript" "index.ts" >}} {{< highlight typescript >}}
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class MyApp extends React.Component {
  render() {
    return (
      <View>
        <Text>Hello world!</Text>
      </View>
    );
  }
}
{{< /highlight >}}


{{< file "dart" "main.dart" >}} {{< highlight dart >}}
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  build(context) {
    return Center(
      child: Text('Hello World'),
    );
  }
}
{{< /highlight >}}

### Full React Native Comparison

Let's go ahead and recreate this [styled component](https://facebook.github.io/react-native/docs/state) from the react native docs. You'll notice the Flutter version on the left has about 65% of the code footprint, with a guarantee of type-safety. Also see the [other examples in this gist](https://gist.github.com/codediodeio/8d59623a3ccac79e9168122b21c4a766). 

{{< figure src="img/flutter-v-react-styles.png" alt="comparison of code footprint between react native and flutter" >}}

Flutter provides several ways to manage component state. You can use `setState` just like React does, but there are some additional built-in techniques. My personal favorite is to represent stateful data as a `Stream` or Rx `Observable`, then use the `StreamBuilder` widget to conditionally paint the UI. As you can see, this does not require any explicit calls to render the UI, rather it's based on the most recent value emitted from the stream. The code footprint is improved slightly, but this gains really add up if you find yourself setting the state frequently. 

{{< figure src="img/state-flutter-v-react.png" alt="comparison of code footprint between react native and flutter for managing component state" >}}
