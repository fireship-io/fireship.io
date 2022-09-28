---
title: How to Run JavaScript Code
lastmod: 2019-04-16T09:12:30-08:00
draft: false
description: How and where to run JavaScript code
weight: 3
emoji: 🚀
free: true
chapter_start: Becoming a JS Developer
---

In order to follow along with this course, you need to know how and where you run your JavaScript code. You have several options to run your first hello world programming:

Open your editor and create a file named `index.js`. 

{{< file "js" "index.js" >}}
```js
console.log('hello world')
```

## How to Run JavaScript from the Command Line

Running a JS program from the command line is handled by NodeJS. Start by installing NodeJS on local machine if necessary. 

1. Install Node.js 

Now simply open the command line in the same directory as the `index.js` script you created (VS Code will do this automatically with the integrated terminal). 

{{< file "terminal" "command line" >}}
```text
node .

// or 

node index.js
```

## How to Run JavaScript from the Browser

When people think of "JavaScript", they most often think of a web browser. You can run code in the browser by creating an HTML file that references the script. In our case, we used the `defer` option, which will execute the JS after the HTML file is finished loading. 

### Run a script from an HTML file

{{< file "html" "index.html" >}}
```html
<html>
    <head>
        <script defer src="./index.js"></script>
    </head>
</html>
```

Now simply open this HTML file on your local machine and open the developer console (next step) to see the output. 

### Inspect the Browser Console

In Chrome, you can open the [developer console](https://developers.google.com/web/tools/chrome-devtools/console/) with `Ctrl+Shift+J` (Windows) or `Ctrl+Option+J` (Mac), or manually from the settings menu by selecting *More Tools* -> *Developer Tools*. The console allows you to run code in the browser, similar to how 

{{< figure src="/courses/javascript/img/console-hello-world.png" caption="Output of the browser console in Chrome" >}}


## Run JavaScript with a Framework

It is worth mentioning that frameworks like React, Angular, Svelte, etc will take care of the building & running of your app automatically and provide framework-specific tooling and steps for running code. In the real world, you are more likely to use the tooling provided by the framework to run your code, as opposed to the basic methods shown in this couse. 

## Run JavaScript in a Sandbox

This course uses StackBlitz to run JS code examples in an isolated sandbox in the browser. This is a great option for sharing quick demos and issue reproductions 💡. 

<div>
    <iframe class="frame-full" src="https://stackblitz.com/edit/js-survival-hello-world?embed=1&file=index.js"><iframe>
</div>
