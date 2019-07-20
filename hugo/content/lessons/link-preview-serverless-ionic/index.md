---
title: Modern Web Scraping Guide
lastmod: 2019-07-17T13:01:44-07:00
publishdate: 2019-07-17T13:01:44-07:00
author: Jeff Delaney
draft: false
description: Build a web scraper from scratch with Firebase Cloud Functions, Puppeteer, and NodeJS
tags: 
    - node
    - firebase
    - cloud-functions
    - puppeteer

youtube: 
github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---


Web Scraping Guide with NodeJS and Cloud Functions

In the following lesson, you will learn the build two different types of webscrapers.

{{% box icon="scroll" %}}
It is not possibile to generate link previews entirely from the frontend due to [Cross-Site Scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) vulnerabilities. 
{{% /box %}}


## Initial Setup

Let's start by initilizing Firebase Cloud Functions with JavaScript. 

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
firebase init functions
cd functions
npm i cors

npm run serve
{{< /highlight >}}

The code below is a shell of an HTTP Cloud Function. 

{{< file "js" "functions/index.js" >}}
{{< highlight javascript >}}

const functions = require('firebase-functions');
const cors = require('cors')({ origin: true});


exports.scraper = functions.https.onRequest( async (request, response) => {
    cors(request, response, async () => {


        // Run scraper here

        const data = { hello: 'world' };


        response.send(data)

    });
});

{{< /highlight >}}

At this point, you should receive a response by opening `http://localhost:5000/YOUR-PROJECT/REGION/scraper`


## Strategy A - Basic HTTP Request

The first strategy makes an HTTP request to a URL and expects an HTML document string as the response. But the problem is that there is no DOM in NodeJS, so we need a tool like [cheerio](https://cheerio.js.org/) to process DOM elements. 

The advantage 👍 of this approach is that it is fast and simple, but the disadvantage 👎 is that it will not execute JavaScript or wait for dynamically rendered content. 

### Link Preview Function

An excellent use-case for this strategy is a *link preview* service that shows the name, description, and image of a 3rd party website when a URL posted into an app. For example, when you post a link into an app like Twitter, Facebook, or Slack, it renders out a nice looking preview. 

{{< figure src="img/demo-link-preview.png" alt="Example of link previews from metatags in Slack" >}}


Link previews are made possible by scraping the meta tags from `<head>` of an HTML page. The code requests a URL, then looks for [Twitter](https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started.html) and [OpenGraph](http://ogp.me/) metatags in the response body. Several supporting libraries are used to make the code more reliable and simple. 

- **cheerio** is a NodeJS implementation of jQuery. 
- **node-fetch** is NodeJS implementation of the browser [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). 
- **get-urls** is a utility for extracting URLs from text. 

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
cd functions
npm i cheerio node-fetch get-urls
{{< /highlight >}}


Let's start by building a 

{{< file "js" "functions/index.js" >}}
{{< highlight javascript >}}

{{< /highlight >}}


Next, let's build an HTTP function to handle a request form a frontend app. Notice how the function is wrapped in CORS.  

{{< highlight typescript >}}

{{< /highlight >}}

## Strategy B - Puppeteer for Full Browser Rendering

What if you want to scrape a single page JavaScript app, like Angular or React? Or maybe you want to click buttons and/or log into an account before scraping? These tasks require a fully emulated browser environment that can parse JS and handle events. 


[Puppeteer](https://github.com/GoogleChrome/puppeteer) is a tool built on top of headless chrome, which allows you to run a full browser on the server. This means you can fully interact with a website before extracting the data you need. 


### Instagram Scraper

Instagram on the web uses React, which means we won't see any dynamic content util the page is fully loaded. 

