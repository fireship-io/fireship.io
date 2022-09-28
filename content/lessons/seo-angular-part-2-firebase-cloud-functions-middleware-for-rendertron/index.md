---
title: Middleware for Rendertron
lastmod: 2017-11-08T11:57:04-07:00
publishdate: 2017-11-08T11:57:04-07:00
author: Jeff Delaney
draft: false
description: Configure Firebase Cloud Functions to serve as the middleware for Rendertron
tags: 
    - pro
    - seo
    - angular
    - cloud-functions

# youtube: 
pro: true
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---


In [Angular SEO Part 1](/lessons/seo-angular-part-1-rendertron-meta-tags/), I introduced the awesomeness of Headless Chrome and Rendertron. The only thing missing is the middleware that can determine if incoming traffic is a bot or a regular user. Rendertron has officially supported Express middleware or you can create your own from scratch using Firebase Cloud Functions. As you will see, it's not all that difficult. 

This method works really well with Firebase and here's why...

**Exhibit A**. [Firebase Hosting priorities](https://firebase.google.com/docs/hosting/url-redirects-rewrites#section-priorities) will allow your root URL to load like normal. It will only invoke the function if the user navigates directly to a deeper URL directly, i.e. they click a link that goes directly to `example.com/hello`. The caveat here is that some bots won't see the dynamically rendered content of the root page, just the `index.html` shell. [Googlebot is good at executing JavaScript](https://searchengineland.com/tested-googlebot-crawls-javascript-heres-learned-220157),  and most people share deeper links on social media, so this is only a minor concern. 

**Exhibit B**. A tightly integrated product. You can deploy an entire SEO solution for an Angular Progressive Web app with a single command. Other than adding meta tags to your app, you don't have to change a single line of Angular code. Nobody is paying me to say these nice things BTW - I just call it like I see it. 

{{< figure src="img/slack-linkbot-angular.png" caption="Slackbot preview link" >}}

## Initial Setup

First, you should have an existing Angular app, but this will actually work with any client-side JavaScript framework. 

Next, you will need to initialize both Firebase hosting and cloud functions in your project.

<p class="info">You must have billing enabled in Firebase. We will need to make outside network calls to Rendertron, which is not allowed in the free tier.</p>

```shell
firebase init
```

## Cloud Function Middleware

The Cloud Function is where most of the Angular SEO magic happens. I works by handling incoming requests to your app and will (1) serve up the the Angular app like when dealing with a human being or (2) render the content through Rendertron when dealing with a bot. 

There's an existing Rentertron [cloud function designed for Polymer](https://github.com/justinribeiro/pwa-firebase-functions-botrender) web components, but it is not compatible with Angular 5 out of the box. I used this function as a starting point and modified it play well with Angular. 


### index.js

What it does is amazingly simple. Let's break it down step by step

1. Receives the request.
2. Looks at the user-agent header and determines if it is a bot. 
3. (a) If it's a bot, it runs the request through Rendertron and responds with the serialized content. 
3. (b) If it's a human, it serves the Angular app like normal. 

That's literally all it needs to do. 

The cloud function will be invoked when the user first navigates to the app or if they refresh the browser window. 

The request is wrapped in [ExpressJS](https://expressjs.com/) to provide some syntactic sugar for routing and [node-fetch](https://www.npmjs.com/package/node-fetch) is used to make requests to HTTP endpoints. 

Keep in mind, the bot list is not comprehensive. I have selected the most common linkbots and crawlers, but you may want to add your own to it. 



```js
const functions = require('firebase-functions');
const express = require('express');
const fetch = require('node-fetch');
const url = require('url');
const app = express();


// You might instead set these as environment variables
// I just want to make this example explicitly clear
const appUrl = 'instafire-app.firebaseapp.com';
const renderUrl = 'https://render-tron.appspot.com/render';

// Deploy your own instance of Rendertron for production
// const renderUrl = 'your-rendertron-url';



// Generates the URL 
function generateUrl(request) {
  return url.format({
    protocol: request.protocol,
    host: appUrl, 
    pathname: request.originalUrl
  });
}

  // List of bots to target, add more if you'd like
function detectBot(userAgent) {

  const bots = [
    // search engine crawler bots
    'googlebot',
    'bingbot',
    'yandexbot',
    'duckduckbot',
    'slurp',
    // social media link bots
    'twitterbot',
    'facebookexternalhit',
    'linkedinbot',
    'embedly',
    'baiduspider',
    'pinterest',
    'slackbot',
    'vkshare',
    'facebot',
    'outbrain',
    'w3c_validator'
  ]


  // Return true if the user-agent header matches a bot namespace
  const agent = userAgent.toLowerCase()

  for (const bot of bots) {
    if (agent.indexOf(bot) > -1) {
      console.log('bot detected', bot, agent)
      return true
    }
  }

  console.log('no bots found')
  return false

}

app.get('*', (req, res) => {

  const isBot = detectBot(req.headers['user-agent']);

  if (isBot) {

    const botUrl = generateUrl(req);
    // If Bot, fetch url via rendertron

    fetch(`${renderUrl}/${botUrl}`)
      .then(res => res.text() )
      .then(body => {

        // Set the Vary header to cache the user agent, based on code from:
        // https://github.com/justinribeiro/pwa-firebase-functions-botrender
        res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        res.set('Vary', 'User-Agent');
        
        res.send(body.toString())
      
    });

  } else {

    // Not a bot, fetch the regular Angular app
    // This is not an infinite loop because Firebase Hosting Priorities dictate index.html will be loaded first
    fetch(`https://${appUrl}`)
      .then(res => res.text())
      .then(body => {
        res.send(body.toString());
      })
  }
  
});

exports.app = functions.https.onRequest(app);
```

### firebase.json

When deploying to Firebase hosting, we need to tell it to use the Cloud Function rather than the index.html entry point. Your hosting file should look like this. 

```js
{
    "hosting": {
      "public": "dist",
      "rewrites": [
        {
          "source": "**",
          "function": "app"
        }
      ]
    }
  }
```


Now you're ready to deploy. 

```shell
firebase deploy
```

## Testing SEO in Angular

Now that we have the app deployed, let's test it out. Feel free to [test my deployed Angular SEO live demo](https://instafire-app.firebaseapp.com/) if you're just kicking the tires at this point. 

In the examples below, I am testing the URL that ends with `/firebase-page`. This URL loads an Angular component that uses backend data from Firebase to dynamically create the meta tags. So yeah, you're looking at an SEO solution for Angular and angularfire2. 

### Twitter Card Validator

[Validate twitter cards](https://cards-dev.twitter.com/validator) to make sure your pages look good when somebody tweets them. 

### Fetch as Googlebot

You can fetch as googlebot in Google Webmaster Tools, but there's also handy tool I found that can [fetch as any bot](https://technicalseo.com/seo-tools/fetch-render/).The important thing to note here is that the rendered page has actual `href` links that can be followed by crawlers.  It shows a fully rendered DOM, not just the lonely index.html shell that crawlers see in a normal Angular app. 


{{< figure src="img/seo-dom-angular.png" caption="Parsed DOM with href tags" >}}

### Facebook Open Graph Validator

Facebook also has its own [Open Graph debugger](https://developers.facebook.com/tools/debug/). 


{{< figure src="img/valid-open-graph-angular5.png" caption="Valid OpenGraph tags" >}}


## Conclusion

Headless Chrome is very cutting-edge stuff and will be the future of SEO for client-side frameworks and Progressive Web Apps. Personally, I am not going to miss building complex server-side-rending features that never seem work right. Please contact me on Slack or in the comments if you have any questions or feedback. 
