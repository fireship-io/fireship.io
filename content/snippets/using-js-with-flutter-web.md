---
title: How to use JS with Flutter Web
lastmod: 2020-04-19T08:00:17-07:00
publishdate: 2020-04-19T08:00:17-07:00
author: Jeff Delaney
draft: false
description: How to interop between JavaScript and Dart with Flutter Web
type: lessons
tags: 
    - flutter
    - javascript

# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

[Flutter Web](https://flutter.dev/web) opens the door to building progressive web apps (PWAs) entirely in Dart. However, your Dart code will likely need to interop with JavaScript at some point to access browser APIs and/or your own custom JS apps. The following snippet demonstrates how access JS from a Flutter web app. 

## Using JavaScript in Dart & Flutter

[Dart.js](https://api.dart.dev/stable/2.7.2/dart-js/dart-js-library.html) is a built-in library that can interop with JavaScript. 

### Add a Script

Create a JS file in the `web` directory and add some functions to it. It calls the function from the global `Window` execution context. You can define a top level function, or define values directly on window. 

{{< file "js" "web/app.js" >}}
```javascript
function alertMessage(text) {
    alert(text)
}

window.logger = (flutter_value) => {
   console.log({ js_context: this, flutter_value });
}
```

Make JS available globally via a script tag in the head of the HTML document. Use `defer` to ensure it loads after the HTML body. 

{{< file "html" "web/index.html" >}}
```html
<head>
    <script src="app.js" defer></script>
</head>
```

### Call JS Functions with Dart.js

Flutter can now access your global JS functions and variables. Call a function by name with `callMethod` and optionally pass it a list of arguments. 

{{< file "dart" "main.dart" >}}
```dart
import 'dart:js' as js;

js.context.callMethod('alertMessage', ['Flutter is calling upon JavaScript!']);
```

You can now pass values from Flutter to JS by including them as arguments.

```dart
js.context.callMethod('logger', [_someFlutterState]);
```

### Access JS Objects in Flutter

Imagine you have some data in JavaScript that you want to access in Flutter. You can take a JSON-serializable JS object and covert it for use in Dart like so. 

{{< file "js" "web/app.js" >}}
```javascript
window.state = {
    hello: 'world'
}
```

Now make use of this JS object in Flutter. 

{{< file "dart" "main.dart" >}}
```dart
import 'dart:js' as js;

var state = js.JsObject.fromBrowserObject(js.context['state']);
print(state['hello']);
```