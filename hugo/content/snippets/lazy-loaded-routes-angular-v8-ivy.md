---
title: Lazy Loaded Routes Angular V8 with Ivy
lastmod: 2019-08-27T08:01:59-07:00
publishdate: 2019-03-13T08:01:59-07:00
author: Jeff Delaney
draft: false
description: Setup Lazy Loaded Routes in Angular 8 with Ivy and Dynamic Imports
tags: 
    - angular

type: lessons
youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "@angular/core": 8.0
---

The following snippet will show you how to setup lazy-loaded routes in Angular v8.0 (and previous versions).

Note. This is now the default way to generate lazy routes in Angular, Ivy does not need to be enabled. 


{{< file "terminal" "command line" >}}
{{< highlight text >}}
ng new myLazyApp --routing
{{< /highlight >}}

Now add a link that you can click. 

{{< file "html" "app.component.html" >}}
{{< highlight html >}}
<button routerLink="/lazy"></button>
<router-outlet></router-outlet>
{{< /highlight >}}


## Step 1: Create a Module and Component

You lazy-load code in Angular by organizing it into modules. A common practice is to lazy-load each routed page in the app. 

{{< file "terminal" "command line" >}}
{{< highlight text >}}
ng g module lazy --routing

ng g component lazy/lazy-page
{{< /highlight >}}


## Step 2: Add Routing to the Lazy Module

{{< file "ngts" "lazy-routing.module.ts" >}}
{{< highlight text >}}
import { LazyPageComponent } from './lazy-page/lazy-page/lazy-page.component';
import { RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: LazyPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LazyModule { }
{{< /highlight >}}

## Step 3: Lazy Load it from the App Router

Angular Ivy makes it possible to use [dynamic imports](https://developers.google.com/web/updates/2017/11/dynamic-import) - an awesome new web standard - that enables async loading of JS modules. 

{{< box icon="scroll" class="box-blue" >}}
If using the dynamic import method shown below make sure to enable Angular Ivy in your project. Existing projects can follow this [Ivy upgrade guide](/snippets/angular-upgrade-with-ivy). 
{{< /box >}}

{{< file "ngts" "app-routing.module.ts" >}}
{{< highlight typescript >}}
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'lazy',
    loadChildren: './lazy/lazy.module#LazyModule', // use this syntax for non-ivy or Angular 7 and below
    loadChildren : () => import('./lazy/lazy.module').then(m => m.LazyModule), // new dynamic import method
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

{{< /highlight >}}

