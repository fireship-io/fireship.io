---
title: Flutter for JavaScript Developers
lastmod: 2019-01-15T12:28:17-07:00
publishdate: 2019-01-15T12:28:17-07:00
author: Jeff Delaney
draft: false
description: A guide to Dart and Flutter for JavaScript Developers
tags: 
    - dart
    - flutter
    - javascript
    - typescript

# youtube: 
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

versions:
   flutter: 1.0
   dart: 2
---

So you're a web developer working with JavaScript and you want to get into Flutter? That was me about one-year ago and, at the time, learning an uncommon language like Dart seemed ridiculous. Then I tried it... To my surprise, it felt very comfortable right out of the gate. This is is partly due to my use of TypeScript over the last few years, so JS devs that hate type systems my experience different results. 

JavaScript and C# have had two babies

{{% box icon="scroll" class="" %}}
Throughout this lesson, you will see the 👉 emoji. Dart will always be on the left, and JS on the right. These are not always perfect 1-to-1 comparisons, but you get the idea. 
{{% /box %}}

## Basics

### Variables

- final 👉 const
-  

```ts
let foo = 'bar';
const lucky = 23;
```

```dart
final int luckNumber = 23;
```

### Functions
### 

## TypeScript Type Annotations


```ts
var foo = 'bar';
const lucky: number = 23;
```

```dart
final int lucky = 23;
```

## Classes


### Constructors

### Getters/Setters

### 

## Async Programming

### Future 👉 Promise

Dart provides 

The dart syntax is almost identical to JS, which is really nice because this is one of the more complex concepts for new devs to learn. 

### Stream 👉 Observable

JavaScript does not have a *native* stream-like data structure [yet](https://github.com/tc39/proposal-observable), but they are commonly provided via supporting packages like RxJS, Mobx, and others. A stream is similar.  

There is one big concept to keep in mind, single subscription streams (default) will throw an error if multiple subscribers try to listen. 

- Single-subscription streams 👉 Cold observable
- Broadcast streams 👉 Hot Observable


Even though streams are available in Dart, I often find myself using [RxDart](https://pub.dartlang.org/packages/rxdart) in Flutter. The beauty of RxDart is that it builds on top of streams, rather than try to reinvent the wheel, so anything that uses a stream in Flutter can also use an Rx observable. Also, if you're coming from the Angular world you can keep the operators you know and love like `switchMap`, `takeUntil`, `scan`, and so on. 

## Flutter vs JS Frameworks

Flutter is inspired by JavaScript frameworks like React/Angular/Vue that enable components to reactively update the UI when data changes. In fact, Flutter provides a `setState` method that works exactly like it does in [ReactJS](https://reactjs.org/docs/react-component.html#setstate).

Overall, it is not very opinionated about how architect the app. You can use composition to build a bunch of tiny widgets and piece them together, or create big widgets to be inherited. 

### Widget 👉 Component

### Themes and Styles 👉 CSS

In flutter you create themes and style widgets directly directly. This 