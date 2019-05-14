---
title: Advanced Flutter Firebase
lastmod: 2019-05-11T13:59:08-07:00
publishdate: 2019-05-11T13:59:08-07:00
author: Jeff Delaney
draft: true
description: Advanced techniques when working with Firebase Auth & Firestore in large complex Flutter applications. 
tags: 
    - typescript

youtube: 
github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

The following article discusses patterns that I have found exceptionally useful when working. 

## Sharing Global Data

### Static Values and Services

When it comes to static values that never change I would highly recommend that you *Keep it Simple*. Dart supports global variables, so you could just instantiate objects outside of the widget tree as needed, but this will pollute the global namespace.

A solution that provides organization and also code-readability is to a dedicated class that defines static properties and methods. This ensures that you always know where the value origninated and helps prevent the creation of duplicate instances. 

{{< file "dart" "globals.dart" >}}
{{< highlight dart >}}
class Global {
  // App Data
  static final String title = 'Fireship';

  // Services
  static final FirebaseAnalytics analytics = FirebaseAnalytics();

  // Helper Methods
  static doSomethingCool() => print('cool');

}

FlatButton(child: Text(Global.title), onTapped: Global.doSomethingCool );

{{< /highlight >}}

As an alternaitve, you can break your data into multiple global singletons with the get_it library. 

### Global Streams

Streams are a bit more complex because we need to explictly listen to them and dispose of them when done - this can lead to a lot of boilerplate when done manually. 

One option is to use Flutter's built in `StreamBuilder` widget, but it can still be difficult to work with if you have multiple streams and/or need to listen to their values in multiple places. 

Fortunately, this is where the [Provider]() package comes to the rescue. It provides syntatic sugar for InheritedWidget, but also has a mechanism for managing Stream subscriptions. In the snippet below, we wrap the entire MaterialApp in with a `MultiProvider`, then define the streams we want to listen to. 

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
import 'package:provider/provider.dart';
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {

    return MultiProvider(
      providers: [
        // Make user stream available
        StreamProvider<FirebaseUser>.value(stream: FirebaseAuth.instance.onAuthStateChanged),

        // See implementation details in next sections
        StreamProvider<Item>.value(stream: firestoreStream),
      ],

      // All data will be available in this child and descendents
      child: MaterialApp(...)
    );
  }
}
{{< /highlight >}}


The beauty of this approach is that `StreamProvider` will automatically listen to the subscription for us (an dispose if necessary), allowing us to treat the underlying data as a synchronous value avaiable to entire app. We can access it in a build method like so:

{{< highlight dart >}}
// Some widget deeply nested in the widget tree...
class SomeWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
      var user = Provider.of<FirebaseUser>(context);

      return Text(user.displayName)
      
  }
}
{{< /highlight >}}


## Deserializing Firebase Data to a Dart Class

Unlike TypeScript, you cannot just overlay an Interface over an Object or Map and have it accept those types. 

Firebase returns data from Firestore in the form of a `Map`. It is perfectly fine to call properties on a map in your code:

{{< highlight dart >}}
Text(data['title']),
Text(data['description'])
{{< /highlight >}}

But this becomes increasingly difficult as your app grows, both in terms of code-maintainabilily and unexpected runtime errors. Deserialization is the process of converting a Map to a Class instance, allow us to write code like: 

{{< highlight dart >}}
Text(data.title),
Text(data.description)
{{< /highlight >}}

### Abstract Classes with a fromMap Constructor

There are several JSON deserialization strategies in Flutter, but I've found hand-written classes to be the most reliable approach. 




## Database Services

Now that you know how to deserialize data, the next challenge is to write an efficient service for fetching and writing data in your app. 

### Option 1 - Generics

You cannot instantiate a generic type in Dart, but you can map types to their constructors in a closure. This is very useful for serialization when working with many handwritten classes, especially because Firebase can return data as both a `Future` and `Stream`. It allows us to implement business logic once that can be applied to as many data models as needed - *convention over configuration*. 

The main drawback is that you need to keep the constructor mapping updated manually and available as a global variable. 



### Option 2 - Specialized Database Service

An alternative approach is to implement a service for the exact needs of your app.