---
title: Angular Universal SSR Cookbook
lastmod: 2019-01-24T07:14:41-07:00
publishdate: 2019-01-24T07:14:41-07:00
author: Jeff Delaney
draft: false
description: Common recipes and solutions for serverside rendering (SSR) with Angular Universal 
tags: 
    - angular

# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

Angular Universal is a powerful tool that allows us to render our applications on the server, but it contains many pitfalls because NodeJS does not have the same APIs as the DOM. The snippet contains a collection of recipes to for common SSR use cases. 

{{< box icon="angular" class="box-orange" >}}
### Work in Progress

This snippet is a work in progress. If you have a useful addition feel free to add it below by making a [pull request on Github](/snippets/git-how-to-participate-on-github). 
{{< /box >}}

## Platform Checking

In some cases, you may have code that should only run in the browser. You can do this by checking the platform and using conditional logic in your components. 

{{< file "ngts" "some.component.ts" >}}
{{< highlight typescript >}}
import { Component, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component(...)
export class SomeComponent {
  isBrowser: boolean;

  constructor( @Inject(PLATFORM_ID) platformId) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
}
{{< /highlight >}}

{{< file "html" "foo.component.html" >}}
{{< highlight html >}}
<button *ngIf="isBrowser">
   <!-- Only show on browsers -->
</button>
{{< /highlight >}}