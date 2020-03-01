---
title: Routing
description: Create a home page configured with the Angular Router. 
weight: 25
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 358715861
emoji: 🏠
video_length: 2:56
---

Learn routing basics in Angular and the usage of the `routerLink` directive in templates. 

## Steps

### Step 1 - Generate a Component

Generate home page component that is loaded by the router. 

{{< file "terminal" "command line" >}}
{{< highlight text >}}
ng g component home-page
{{< /highlight >}}

### Step 2 - Register it in the Router

{{< file "ngts" "app-routing.module.ts" >}}
{{< highlight typescript >}}
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';


const routes: Routes = [
  { path: '', component: HomePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

{{< /highlight >}}

### Step 3 - Navigate with routerLink

Example of a router link with a special CSS class when active. 

{{< file "html" "some.component.html" >}}
{{< highlight html >}}
<a routerLink="/" routerLinkActive="some-css-class">Home page</a>
{{< /highlight >}}