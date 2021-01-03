---
title: Angular Universal SSR with Firebase
lastmod: 2019-01-22T08:27:40-07:00
publishdate: 2019-01-22T08:27:40-07:00
author: Jeff Delaney
draft: false
description: A comprehensive guide to server-side rendering with Angular Universal and Firebase
tags:
    - angular
    - firebase
    - cloud-functions
    - node

youtube: VS0zsXvDJ08
github: https://github.com/fireship-io/159-angular-universal-cloud-functions
# disable_toc: true
# disable_qna: true

# courses
# step: 0

versions:
   '@angular/core': 7.2
   'firebase-functions': 2
   'node': 8.14.0
---

Nothing beats the user experience of a single page JS app on the web, but you sacrifice the ability to share metatags with social media bots and search engines on deep links. Fortunately, you can overcome this limitation with server-side rendering (SSR) via [Angular Universal](https://angular.io/guide/universal).

The following lesson will show you how to setup Angular Universal with ExpressJS. In addition, you will learn how to deploy the app with (1) Node via **AppEngine** or (2) Firebase **Cloud Functions** - both of which are are on the free tier.

## Step 0: Prerequisites

1. {{< prereq "install-angular" >}}
1. {{< prereq "install-angularfire" >}}
1. Install [Google Cloud SDK](https://cloud.google.com/sdk/install)
1. Install [Firebase Tools](https://github.com/firebase/firebase-tools)

{{< box icon="angular" class="box-blue" >}}
**What is Angular Universal?**

Angular is a client-side framework designed to run apps in the browser. Universal is a tool that can run your Angular app on the server, allowing fully rendered HTML to be served on any route. After the initial page load, Angular will take over and use the router for all other route changes. This primary use cases include search engine optimization (SEO), visibility with social linkbots, and performance optimization.
{{< /box >}}

{{< box icon="fire" class="box-orange" >}}
I highly recommend using [NVM](/snippets/install-nodejs/) with Node `v8.14.0` in your local environment. This is the version running on AppEngine and Cloud Functions and you might get unexpected errors on other versions.
{{< /box >}}

## Step 1: Setup Universal in Angular

### NG Add Universal

{{< file "terminal" "command line" >}}
{{< highlight text >}}
ng add @nguniversal/express-engine --clientProject myapp
{{< /highlight >}}

This will add several new files to your project. The Angular Universal app is used to render your angular code on a server:

- src/main.server.ts
- src/app/app.server.module.ts
- src/tsconfig.server.json

Then ExpressJS is the actual server that will handle requests/responses and is defined by these files:

- webpack.server.config.js
- server.ts

## Step 2: Render Dynamic Titles and Meta Tags in Angular

Our angular app needs a router-loaded component that generates its own metatags. The following example will hard code the meta tags, but you can also build them dynamically by reading data from your database.

{{< file "terminal" "command line" >}}
{{< highlight text >}}
ng g component about -m app
{{< /highlight >}}


### Configure the Router

At this point, let's build a basic component that renders dynamic meta tags based on the route ID.


{{< file "ngts" "app-routing.module.ts" >}}
{{< highlight typescript >}}
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent }
];
{{< /highlight >}}


### Create the Component

Angular has built-in services to change the title and metatags in the document body.

{{< file "ngts" "about.component.ts" >}}
{{< highlight typescript >}}
import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  data = {
    name: 'Michael Jordan',
    bio: 'Former baseball player',
    image: 'avatar.png'
  };

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle(this.data.name);
    this.meta.addTags([
      { name: 'twitter:card', content: 'summary' },
      { name: 'og:url', content: '/about' },
      { name: 'og:title', content: this.data.name },
      { name: 'og:description', content: this.data.bio },
      { name: 'og:image', content: this.data.image }
    ]);
  }
}
{{< /highlight >}}

## Step 3: Compile/Test the Server Locally

### Compile the Server

Open the `package.json` file and you'll notice four new scripts related to SSR. Run the commands below to compiple the TypeScript code and run the Express server on *localhost:4000*.

{{< file "terminal" "command line" >}}
{{< highlight text >}}
npm run build:ssr
npm run serve:ssr
{{< /highlight >}}

At this point, you should see an error that looks like this because our server is thowing an error for missing `XHLHttpRequest`. See the next step to fix it.

{{< figure src="img/ssr-cannot-be-reached.png" alt="broken universal app" >}}


### Add Firebase Polyfills to Express

Firebase uses Websockets and XHR not included in Angular that we need to polyfill.

{{< file "terminal" "command line" >}}
{{< highlight text >}}
npm install ws xhr2 bufferutil utf-8-validate  -D
{{< /highlight >}}

Then declare them on Node `global` at the top of the server file.

{{< file "typescript" "server.ts" >}}
{{< highlight typescript >}}
(global as any).WebSocket = require('ws');
(global as any).XMLHttpRequest = require('xhr2');

// ...
{{< /highlight >}}

Rebuild your app and restart the server. The HTML returned from Express should now include custom meta tags.

{{< figure src="img/working-universal-app.png" alt="working universal app" >}}

## Deploy Option A - AppEngine Node Standard

### Command Line Deploy

Deploying to [AppEngine](https://cloud.google.com/appengine/docs/standard/nodejs/) will containerize your code allow it to scale infinitely in the cloud. It starts on a free tier and can scale up automatically based on traffic or resource demands.

Crate an *app.yaml* file in the root the project. The standard environment for Node8 and Node10 is free to deploy with a small instance and can automatically scale the moon 🌙 as needed. 

{{< file "yaml" "app.yaml" >}}
{{< highlight yaml >}}
runtime: nodejs8
{{< /highlight >}}


With Google Cloud SDK installed on your system, simply run the deploy command.

{{< file "terminal" "command line" >}}
{{< highlight text >}}
gcloud app deploy
{{< /highlight >}}

Also, update the start command in the package.json to run Express server.

{{< file "npm" "package.json" >}}
{{< highlight json >}}
{
  "scripts": {
    "start": "npm run serve:ssr"
  }
}
{{< /highlight >}}

If all went according to plan, you should now see your app on the AppEngine dashboard.



{{< figure src="img/angular-appengine.png" alt="angular universal app deployed to app engine" >}}


## Deploy Option B - Firebase Cloud Functions

An alternative to AppEngine is to rewrite your Firebase Hosting rules to a [Firebase Cloud Function](https://firebase.google.com/docs/functions/).

{{< file "terminal" "command line" >}}
{{< highlight text >}}
firebase init

# select hosting, functions
{{< /highlight >}}

Now make your public folder `dist/browser`, but rewrite all traffic to a function.

{{< file "terminal" "command line" >}}
{{< highlight json >}}
{
  "hosting": {
    "public": "dist/browser",
     // ...
    "rewrites": [
      {
        "source": "**",
        "function": "ssr"
      }
    ]
  }
}
{{< /highlight >}}

### Remove the Express Server Listener

When deploying to AppEngine we need to tell the server to listen to requests. In Cloud Functions, this is already happening under the hood, so we need to update our server code.

Make sure to export the express app, then remove the call to listen.

{{< file "typescript" "server.ts" >}}
{{< highlight typescript >}}
export const app = express();

// ...

// remove or comment out these lines 👇

// Start up the Node server
// app.listen(PORT, () => {
//   console.log(`Node Express server listening on http://localhost:${PORT}`);
// })
//
{{< /highlight >}}

### Update the Webpack Config

We need to tell the Webpack to package our server code as a library that can be consumed by the Node function. Update the existing config with the following changes.


{{< file "js" "webpack.server.config.js" >}}
{{< highlight javascript >}}
  output: {
    // Puts the output at the root of the dist folder
    path: path.join(__dirname, 'dist'),
    library: 'app',
    libraryTarget: 'umd',
    filename: '[name].js',
  },
{{< /highlight >}}


Make sure to rebuild the Angular app with `npm run build:ssr`.

### Copy the Angular App to the Function Environment

The cloud function needs access to your Angular build in order to render it on the server. Let's write a simple node script that copies the most recent Angular app to the functions dir on build.

{{< file "terminal" "command line" >}}
{{< highlight text >}}
cd functions
npm i fs-extra
{{< /highlight >}}

{{< file "js" "functions/cp-angular.js" >}}
{{< highlight javascript >}}
const fs = require('fs-extra');

(async() => {

    const src = '../dist';
    const copy = './dist';

    await fs.remove(copy);
    await fs.copy(src, copy);

})();
{{< /highlight >}}

Update the build script to copy over your Angular files. While here, you can also mark this function to be deployed with Node v8.

{{< file "npm" "functions/package.json" >}}
{{< highlight json >}}
{
  "name": "functions",
  "engines": {
    "node": "8"
  },
  "scripts": {
    "build": "node cp-angular && tsc"
  }
}
{{< /highlight >}}

The function itself only needs to import the universal app into the current working directory.
That's why we need to copy it to the function's environment.

{{< file "typescript" "functions/index.ts" >}}
{{< highlight typescript >}}
import * as functions from 'firebase-functions';
const universal = require(`${process.cwd()}/dist/server`).app;

export const ssr = functions.https.onRequest(universal);

{{< /highlight >}}

You can test it by serving both the hosting and function simultaneously - the moment of truth...

{{< file "terminal" "command line" >}}
{{< highlight text >}}
cd functions
npm run build
firebase serve
{{< /highlight >}}

You should now be able to visit your server rendered site on **localhost:5000**.

If it looks good, deploy the app with a single command:

{{< file "terminal" "command line" >}}
{{< highlight text >}}
firebase deploy
{{< /highlight >}}

{{< figure src="img/angular-twitter-card.png" alt="Angular Universal cloud functions twitter card validator" >}}


