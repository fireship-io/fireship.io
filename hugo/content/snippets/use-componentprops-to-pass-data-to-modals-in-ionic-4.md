---
title: How to Pass Data to Modals in Ionic
publishdate: 2018-09-22T23:12:09-07:00
lastmod: 2018-09-22T14:25:09-07:00
draft: false
author: Jeff Delaney
description: Pass data to a modal in Ionic 4 with componentProps
tags:
  - ionic
---

The snippet below shows you how to use `componentProps` to pass data into an [Ionic 4 modal](https://beta.ionicframework.com/docs/api/modal/). This technique is useful when updating dynamic data. 

## Pass Data into Ionic4 Modals

In previous versions of Ionic, the `NavParams` class was used to read the passed data. This is no longer necessary and should not be used, although it does still work technically. In version 4, sharing data with a modal is easier than ever...

### Parent Component

The parent component will present the modal and pass data into it. 

```typescript
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';

@Component()
export class SomeParentComponent {
  constructor(public modalController: ModalController) {}

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: { 
        foo: 'hello',
        bar: 'world'
      }
    });
    return await modal.present();
  }
}
```

### Modal Page Component

The child component is the actual modal window and it will consume the data passed to it. So how to use use the data passed in from `componentProps` in the previous step? You just need to declare the property on your class and you're good to go - just make sure it uses the same prop name on both sides of the equation.  

```typescript
import { Component, OnInit } from '@angular/core';

@Component()
export class ModalPage implements OnInit {
  foo;
  bar;

  ngOnInit() {
    console.log(`${foo} ${bar}`)
  }
}


// hello world
```