---
title: PWA Performance Optimization Tips
lastmod: 2017-11-25T12:27:11-07:00
publishdate: 2017-11-25T12:27:11-07:00
author: Jeff Delaney
draft: false
description: Performance analysis and optimization tips for Progressive Web Apps
tags: 
    - pro
    - pwa
    - javascript
    - angular

youtube: _zABfPXnSak
pro: true
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---


The following lesson contains a handful of tips and ideas aimed at optimizing the Lighthouse PWA performance score. Any good optimization starts with a solid analysis, so I will also provide you with some advanced tools for analyzing the performance for your progressive web app.  

## High Performance PWAs with Angular

PWA performance is largely dependent on the way you design your app. In this demo, I am following the [PRPL pattern](https://developers.google.com/web/fundamentals/performance/prpl-pattern/) from Polymer as closely as possible. 

{{< figure src="img/prpl-angular-pwa-01.png" caption="How a web app loads" >}}

 We have an initial loading splash page, then our app module shell (first paint), then firebase loads the data and our page becomes fully interactive.

1. Push critical resources first via index.html.  
2. Render initial route with a very lean app module.
3. Pre-cache remaining routes with the Service Worker. 
4. Lazy-load remaining routes with Angular NgModules. 

The primary drivers of performance in Angular include the size of the resources and number of network calls required to render the page. 



## How to Analyze Bundle Sizes 

The webpack bundle analyzer is a great way to see what's taking up space in your app. Thanks [Cory Rylan for a great overview of this technique](https://coryrylan.com/blog/analyzing-bundle-size-with-the-angular-cli-and-webpack).

First, build your app `ng build --prod --stats-json`. This will add an extra *dist/stats.json* file that contains an analysis of the parts wrapped inside the bundle. 

### Bundle Analysis in Three Easy Steps

1. Install the tool with `npm install webpack-bundle-analyzer -D`
2. Add a new script to your package.json file `"analyzer": "webpack-bundle-analyzer dist/stats.json"`: 
3. Run `npm run analyzer`


{{< figure src="img/bundle-analysis1.png" >}}

As you can see, Angular is a largest resource, while the Firebase SDK is a close second. I will show you how to lazy load firebase in the next step to dramatically reduce the bundle size. 

### Additional Analysis Tools for PWAs

In addition to Lighthouse for Chrome, you might also check out the following tools for additional benchmarking. 

[Web Page Test](https://www.webpagetest.org). Web Page Test gives you the most detailed loading waterfall of any other tool on the web. Hacker News uses it when ranking submissions and it can be very helpful for tracking down bottlenecks. 


{{< figure src="img/waterfall-pwa.png" >}}

[Website Grader by Hubspot](https://website.grader.com/). Although not for PWAs, it's a useful tool to see how you stack up to regular websites with performance, security, and SEO. 


{{< figure src="img/website-grader.png" >}}


## Lazy Loading Dynamic Content

Ok cool, so we know our bundle size is going to impact performance, but *How do you make the main bundle in Angular smaller?* 

I created a simple break down of [lazy loaded modules](https://angularfirebase.com/lessons/how-to-lazy-load-components-in-angular-4-in-three-steps/) here, but let's revisit the process for our Hacker News PWA.   


### 1. Create a Feature Module with it's own Routes

In this case, I have a content module that will be lazy loaded. 

```
ng g module content
```

The module will handle the main views for the Hacker News app and initialize Firebase. This module accounts for about 45% of the total main bundle size. It just needs to import the router, define a few routes, then call `RouterModule.forChild(routes)` in the imports section. The bare-minimum code needed for lazy loading looks like this:

 
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ...omitted

import { Routes, RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

const routes: Routes = [
  { path: 'news', component: StoryFeedComponent },
  { path: 'item/:id', component: StoryDetailComponent },
  { path: 'user/:id', component: UserDetailComponent },
  // ... additional lazy loaded routes
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AngularFireModule.initializeApp({ databaseURL: 'https://hacker-news.firebaseio.com'}),
    AngularFireDatabaseModule
  ],
  declarations: [...components],
  providers: [...services]
})
export class ContentModule { }
```



### 2. Point the App Routing Module to the Lazy Module

The main app routing module will now lazy load the content module whenever the user navigates to a router under the `/hn/` path. In this case, I am automatically redirecting, but you are not required to do this. 

```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';


const routes: Routes = [
  { path: '', redirectTo: 'hn/top', pathMatch: 'full' },
  { path: 'hn', loadChildren: './content/content.module#ContentModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

That's all there is to it. The content module will now be lazy loaded. 

### Updated Bundle Size

Our main bundle size footprint has been cut in half. The larger and more complex the app, the greater the performance gains will be from lazy loading. 

{{< figure src="img/bundle-analysis2.png" >}}

The `chunk.js` bundle will not be required for the initial page load.   

## Other Potential Optimizations

Lazy loading will deliver the largest performance gains, but there are a number of other potential optimizations worth considering. 

### Angular Build Optimizer

<p class="success">If using Angular CLI 1.5 or greater, `--build-optimizer` is enabled by default. </p>

If using Angular CLI < 1.5, run the following command and watch your bundle size magically decrease. 

```shell
ng build --prod --build-optimizer
```

### Reducing the Impact of Render Blocking CSS

If you're using a CSS framework, such as Bootstrap or Material, you might be faced with large render blocking stylesheets. Most CSS frameworks are build in a modular way with SASS, SCSS, or LESS. You can take advantage of these modular libraries by only importing the code you need. For example, why import the CSS code for the bootstrap carousel if your app never uses it? 

1. Try to minimize the footprint of your initial `styles.css` file. 
2. Import shared styles in lazy loaded modules.  

### Optimize Web Fonts

If using web fonts from [Google Fonts](https://fonts.google.com/) or [Adobe TypeKit](https://typekit.com/), it is important to minimize the included fonts to the bare minimum needed for your app. Do you really need that *italic* font in 300, 500, and 700 weights for the initial page load? I would hope not. Consider slimming down fonts and load less common families lazily.  

### Optimize Images

Large images can be a major roadblock in the critical rendering path. If you're displaying a logo on your initial splash page, consider converting it to an Scalable Vector Graphic (SVG) rather than a PNG or JPG. In my case, this optimization cut the logo image size by over 90% from 10KB down to 750Bytes. If SVG is not practical in your case, you should still look to reduce image file sizes with one of the many compression tools available on the web. 

### Server Side Rendering

If you can optimize your critical rending path effectively, it is unlikely you will need SSR for performance. However, there may be some cases where [Angular Universal](https://davidea.st/articles/the-beginners-guide-to-angular-universal) can deliver a significant performance boost by executing your app code on a server, then responding with the fully rendered HTML. The implementation is moderately complex, so I will leave that for another video. Just keep SSR mind if you are unable to optimize your performance score with the strategies discussed in this article. 

That's all for now - let know if you have any other PWA optimization ideas in the comments. 