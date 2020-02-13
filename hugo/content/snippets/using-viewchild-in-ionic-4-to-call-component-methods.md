---
title: Using ViewChild in Ionic to Call Component Methods
lastmod: 2018-08-18T18:39:19-07:00
publishdate: 2018-08-18T18:39:19-07:00
author: Jeff Delaney
draft: false
description: ViewChild is an important tool in Ionic that can be used to call API methods on components. 
tags: 
    - ionic
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

Many of Ionic's components expose API methods for building custom behaviors. But how do you access these API methods on a component that lives in the HTML? 

The [ViewChild](https://angular.io/api/core/ViewChild) decorator is extremely useful in Ionic for grabbing elements from the DOM to call the components API methods in your TS code. Let's use the [menu](https://beta.ionicframework.com/docs/api/menu/) component as an example. Out of the box, the only way to close it is by tapping outside of it, but you might more programmatic control over it. 

## Grab Ionic Components with ViewChild

Let's imagine we have a `HomePage` component that looks like this and we want to close the menu when an item is clicked. 

```html
<ion-menu>
  <!-- with some stuff inside -->
</ion-menu>
```

Our goal is to access the `ion-menu` from the TypeScript code so we can call its API methods, like `open()` and `close()`. 

```typescript
import { Component, ViewChild } from '@angular/core';
import { Menu } from '@ionic/angular';

@Component(...)
export class HomePage {

  @ViewChild(Menu) menu: Menu;


  onDrag() {
    this.menu.close();
  }
}
```

## Shortcut: Use Template Variables

There's actually a very convenient shortcut to using ViewChild in a component. We never have to leave the HTML by setting a template variable in Angular. In this example we reference the menu component with a hashtag and variable name `#mymenu`. 

```html
<ion-menu #mymenu>
  <!-- with some stuff inside -->

  <ion-item (click)="mymenu.close()"></ion-item>
</ion-menu>
```

And we're done. Much easier then using ViewChild in the TypeScript. 

## Grabbing Multiple Components with ViewChildren

You might also run into a situation where there are multiple components of the same type on the page, such as multiple FABs:

```html
<ion-fab></ion-fab>
<ion-fab></ion-fab>
<ion-fab></ion-fab>
```

`ViewChildren` is almost the same, but it will grab all elements that match this component and return them as an Array. 

```typescript
import { Component, ViewChildren } from '@angular/core';
import { Fab } from '@ionic/angular';

@Component(...)
export class HomePage {

  @ViewChildren(Fab) fabs: Fab[];


  closeFirst() {
    this.fabs[0].close();
  }
}
```

Now that you know about `ViewChild`, you should have no problem accessing the API methods found on Ionic's web components. 