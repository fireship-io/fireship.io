---
title: Flutter State Management Guide
lastmod: 2019-03-08T15:19:53-07:00
publishdate: 2019-03-08T15:19:53-07:00
author: Jeff Delaney
draft: false
description: A guided tour of reactive state management strategies in Flutter
tags: 
    - flutter
    - dart
    - rxdart

youtube: 3tm-R7ymwhc
github: https://github.com/fireship-io/172-flutter-state-management-strategies
# disable_toc: true
# disable_qna: trueng 
# courses
# step: 0

versions:
   rxdart: 0.20
---

State management is a hot-button topic that brings out strong opinions in developers, and in extreme cases results in Twitter fights. In my experience, people tend to over-engineer features that would otherwise be straight-forward because they assume a full-blown state management library is necessary. In some cases, they just add complexity, but in others, they can be extremely valuable. My recommendation is to analyze these strategies closely and choose an approach that feels right for your app's requirements and your team's style. 

The following lesson is designed to teach you the fundamental tools in [Flutter](https://flutter.dev/docs/development/data-and-backend/state-mgmt) for managing local and shared app state. 

## What is State? 

**What is State?** State is just *data that changes* over the lifecycle of the app. When stateful data changes, the UI reacts by painting our widgets to reflect the new state. Your UI is just a visual representation of a given state. It's like calling a function with the state as the input and UI as the return value `function(state) => UI`, and Flutter calls this function when you rebuild your widgets. 

{{< figure src="img/state-management-demo.png" caption="In the counter app above, the number in the middle is the state. Tapping the button at the bottom is like calling a function with the next state, resulting in a different number in the UI. ">}}

**Why does state need to be managed?** As your app grows in complexity, you are likely to encounter bugs directly related to the way data flows through your app via user input. Managing the state changes carefully helps you avoid soul-crushing bugs that only happen at runtime and can also help optimize performance. 

We will look at a variety of widgets packaged in Flutter used to manage state. 

- *StatefulWidget*
- *StatefulBuilder*
- *StreamBuilder*
- *InheritedWidget*

We will start with nothing but Flutter, then add additional tools like [RxDart](https://pub.dartlang.org/packages/rxdart) and [Flutter Bloc](https://pub.dartlang.org/packages/bloc) to extend our state management possibilities. 

## Local State 

In many cases, you can encapsulate all your data in a single widget. Ask yourself *do I need to access this data in other widgets?* If **no**, you can use the techniques described below. If **yes**, you will likely benefit from a shared state strategy in the next section. 



TIP: In Flutter, data moves from top to bottom. If you have data in a child widget that you want to send up to a parent, you should use one of the global state management methods described in the second half of this lesson. 


{{< figure src="img/flutter-widget-tree.png" caption="Flutter widget tree... Parent to child, good. Anything else, bad." >}}

### StatefulWidget

StatefulWidgets come with a built-in a `setState` method that you can call to repaint the widget. Calling it will run the build method you have implemented and repaint all the descendants of this widget. 

{{< file "dart" "main.dart" >}}
```dart
class MyHomePage extends StatefulWidget {
 createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;  // <-- the stateful data

  void _incrementCounter() {
    setState(() {  <-- the special method called to update state
      _counter++; 
    });
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      body: Text('$_counter'), // <-- the state used in a widget

      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,  // <-- the state changed on button tap event
      ), 
    );
  }
}
```

I tend to avoid *StatefulWidgets* in favor the *Builder* widgets described next. StatefulWidgets require two classes and a decent amount of boilerplate. Thankfully, there are easier ways to handle local state. 

### StatefulBuilder

{{< file "dart" "main.dart" >}}
```dart
class MyHomePage2 extends StatelessWidget {

  int _counter = 0;

  @override
  Widget build(BuildContext context) {
    return StatefulBuilder(
      builder: (ctx, StateSetter setState) => 
        Scaffold(
          body:Text('$_counter'),
          floatingActionButton: FloatingActionButton(
            onPressed: () => setState(() => _counter++),
          ), 
        )
    );
  }
}
```

## Global or Shared App State

It's common to have widgets dispersed throughout the widget tree that depend on the same data. If the source of this data is at the top of the widget tree, you can pass it down, but that becomes very cumbersome when multiple levels are involved. If the data is at the bottom of the widget tree, you're SOL - unless of course you implement one of the solutions described next. 


### InheritedWidget

Flutter provides an [InheritedWidget](https://docs.flutter.io/flutter/widgets/InheritedWidget-class.html) that can define provide context to every widget below it in the tree. 

While this is nice in theory, you can see that it takes quite a lot of code to get a basic example wired up. Fortunately, there are libraries like Bloc, Redux, and Scoped Model abstract this complexity away. 

{{< file "dart" "main.dart" >}}
```dart
class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: InheritedCounter( child: MyHomePage3() ), // <-- make sure your InheritedWidget wraps the widgets that use its data
    );
  }
}


// The InheritedWidget
class InheritedCounter extends InheritedWidget {
  final Map _counter = { 'val': 0 };  // Data structure is a map because InheritedWidgets are immutable
  final Widget child;

  InheritedCounter({ this.child }) : super(child: child);

  increment() { 
     _counter['val']++;
  }

  get counter => _counter['val'];

  @override
  bool updateShouldNotify(InheritedCounter oldWidget) => true;

  static InheritedCounter of(BuildContext context) =>
      context.inheritFromWidgetOfExactType(InheritedCounter);
}



class MyHomePage3 extends StatelessWidget {

  @override
  Widget build(BuildContext context) {

   return StatefulBuilder(
      builder: (BuildContext context, StateSetter setState) {

        int counter = InheritedCounter.of(context).counter;
        Function increment = InheritedCounter.of(context).increment;

        return Scaffold(

          body: Text('$counter'),
          floatingActionButton: FloatingActionButton(
            onPressed: () => setState(() => increment()),
          ), 
          
        );
      }
    );
  }
}
```

### StreamBuilder + RxDart BehaviorSubject


This is my preferred way to manage global state in Flutter. It's flexible, provides a good separation of concerns, and just feels intuitive to me. 


The *BehaviorSubject* has a variety of characteristics that make it ideal for state management. 

- Has a current value that can be accessed synchronously. 
- Exposes a shared/broadcast stream. 
- Can be controlled by adding new items the stream. 
- Can be transformed with RxDart operators. 

We use this magical tool start the count at zero, then increment by reading the current value and adding 1 to it. The `Counter` class provides business logic and state that can be used everywhere and tested in isolation. 

Back in the widget tree, we can pass the Observable `stream$` to a `StreamBuilder` to rebuild anytime a new value is emitted. 

{{< file "dart" "main.dart" >}}
```dart
import 'package:rxdart/rxdart.dart';

// Global Variable 
Counter counterService = Counter();

// Data Model
class Counter {

  BehaviorSubject _counter = BehaviorSubject.seeded(0);

  Observable get stream$ => _counter.stream;
  int get current => _counter.value;

  increment() { 
    _counter.add(current + 1);
  }

}

// StreamBuilder Widget
class MyHomePage4 extends StatelessWidget {


  @override
  Widget build(BuildContext context) {

      return Scaffold(
            body: StreamBuilder(
                stream: counterService.stream$,
                builder: (BuildContext context, AsyncSnapshot snap) {
                  return Text('${snap.data}');
                }
            ),

            floatingActionButton: FloatingActionButton(
              onPressed: () => counterService.increment(),
            ), 
      );
  }
}
```

The one issue that with this implementation is that it uses on a global variable to share the data model - this is generally frowned upon ☹️. We can easily overcome this issue with a little service locator library called [Get It](https://pub.dartlang.org/packages/get_it) that allows us to define and access a global singleton. It ensures we don't accidentily instantiate multiple state containers and provides additional benefits for integration testing within Flutter widgets. 

We can now safely use our global singleton in any widget that requires it. 

{{< file "dart" "main.dart" >}}
```dart
import 'package:get_it/get_it.dart';

GetIt getIt = new GetIt();

void main() {
  getIt.registerSingleton<Counter>(Counter());
  runApp(MyApp());
} 

class MyHomePage4 extends StatelessWidget {
    final counterService = getIt.get<Counter>();

    // ...

}
```



### BLoC 

The BLoC pattern is similar to an InheritedWidget, but more intuitive and scalable for state management. Although not necessary, I highly recommend using the  [flutter_bloc](https://pub.dartlang.org/packages/flutter_bloc) package to help you apply this pattern consistently in your code. The general process is similar to [Redux](https://redux.js.org/) and involves the following steps. 

1. Define Events/Actions
2. Define a custom Bloc class that implements `mapEventToState` to compute the state when an action is dispatched. 
3. Place the BlocProvider in the widget tree to give all children access to its data. 
4. Reference the provider from a widget with `BlocProvider.of<MyBloc>(context)`
5. Use the `BlockBuilder` to rebuild on state changes.
6. Use `dispatch` to emit events that mutate the state. 

{{< file "dart" "main.dart" >}}
```dart
import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

enum CounterEvent { increment } // 1

class CounterBloc extends Bloc<CounterEvent, int> { // 2
  @override
  int get initialState => 0;

  @override
  Stream<int> mapEventToState(int currentState, CounterEvent event) async* {
    switch (event) {
      case CounterEvent.increment:
        yield currentState + 1;
        break;
    }
  }
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: BlocProvider<CounterBloc>(  // 3
        bloc:CounterBloc(),
        child: MyHomePage5()
      ),
    );
  }
}


class MyHomePage5 extends StatelessWidget {
  

  @override
  Widget build(BuildContext context) {

    final CounterBloc _counterBloc = BlocProvider.of<CounterBloc>(context); // 4

      return Scaffold(
        appBar: AppBar(
          title: Text('BLoC'),
        ),
        body: BlocBuilder(  // 5
                bloc: _counterBloc,
                builder: (BuildContext context, int count) {
                  return Text(
                    '${count}',
                  );
                }
              ),
        floatingActionButton: FloatingActionButton(
          onPressed: () => _counterBloc.dispatch(CounterEvent.increment), // 6
        ), 
      );
  }
}
```

## Additional State Management Libraries in Flutter


Below is an overview of the additional state management options that should be on your radar. 

### Scoped Model
 
If you need shared state, but feel like Bloc is too heavy and explicit, you should check out Scoped Model. Flutter recently added a detailed intro of [scoped_model](https://flutter.dev/docs/development/data-and-backend/state-mgmt/simple) to the official docs. It extends InheritedWidget to share context, but does not require actions, reducers, or any other low-level concepts. 

### Redux

[Redux](https://pub.dartlang.org/packages/flutter_redux) is the de facto state management solution in ReactJS - if you already know it, it may be the best place to get started in Flutter 

### MobX

[Mobx](https://pub.dartlang.org/packages/mobx) just hit the Flutter scene and that's great news for developers. It applies concepts similar to Redux and Bloc, but also supplies a codegen package and decorators to make the process more developer friendly. 

### Flutter Hooks

[Flutter Hooks](https://pub.dartlang.org/packages/flutter_hooks) is an implementation of React Hooks that provides elegant abstractions for code reuse and state management. In my experience, hooks in ReactJS are very beneficial to productivity, so I hope to see this package continue progressing in Flutter. 


### Firebase - State with a Backend 

Yes, the [Firebase SDK](https://fireship.io/snippets/install-flutterfire/) provides you with a very powerful stream-based state management library out of the box, with the added benefit of persisting your data in the cloud. It is not perfect for every situation, but often solves the most complex requirements like user auth, database persistence, remote config, and so on. 



Hopefully that is more than enough ideas to get you started with state management in Flutter, but this is a highly active area of development, so expect this topic to evolve moving forward. 