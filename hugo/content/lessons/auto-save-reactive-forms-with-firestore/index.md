---
title: Auto-save Reactive Form with Firestore
lastmod: 2018-05-28T14:17:17-07:00
publishdate: 2018-05-28T14:17:17-07:00
author: Jeff Delaney
draft: false
description: Build reactive forms that preload and autosave data with Firestore
tags: 
    - pro
    - angular
    - firestore
    - forms

pro: true
youtube: In5b6TDxb30
github: https://github.com/AngularFirebase/108-autosave-reactive-froms-firestore
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Forms are one of the most critical, yet most cumbersome aspects of app development. They require a ton of HTML markup and require complex validation rules for a good user experience. Almost all forms must be synced to a backend database, leaving us faced a state management conundrum that is not always easy to solve. In this lesson, my goal is to provide you with a reliable solution for syncing your frondend forms to any backend database. 

Angular's [ReactiveFormsModule](https://angular.io/guide/reactive-forms) is basically a standalone state management system, while Firebase manages its own state under the hood. We want to combine these tools into a unified system by building a reusable directive that makes working with Firestore and Reactive Forms nearly automatic. 

{{< figure src="img/reactive-forms-firestore-demo.gif" caption="Auto saving reactive form to firestore database" >}}


## Syncing Reactive Forms to a Backend

There are several different strategies one could employ to sync their reactive forms a backend database. In our case, we will use [Cloud Firestore](https://firebase.google.com/docs/firestore/) and [AngularFire2](https://github.com/angular/angularfire2). Here's how the basic process will work from a high level. 

1. Preload existing data from the database into the form. 
2. Listen to changes in the reactive form value.
3. [Debounce](https://www.learnrxjs.io/operators/filtering/debouncetime.html) for a few seconds.
4. Write the changes to the database. 
5. Repeat steps 2 through 4. 


## Firestore Form Directive 

An Angular [Attribute Directive](https://angular.io/guide/attribute-directives) can be used to abstract away the backend database work, giving us reusable code for multiple forms. 

```shell
ng g directive fire-form
```

When we're done, basic usage will look like this. Drop the directive into a form, point to a Firestore document and the rest is magic. 

```html
<form [formGroup]="yourForm" fireForm path="contacts">

</form>
```

The `path` attribute represents the firestore document or collection were the data will be saved. When pointing to a collection, it will automatically create a new document. Otherwise, you can point directly to an existing document ID. 

```html
<form ... path="contacts/someExistingID">

</form>
```

### fireform.directive.ts

There is quite a bit happening in this directive to manage the state between the reactive form and Firestore database. Let's break down some of the key points. 

The [Output/EventEmitter](https://angular.io/api/core/EventEmitter) properties are used to emit events about state changes to the parent component. We need to to let the parent know when the form is modified, synced, or throws a backend error. A TypeScript setter is used to emit an event and change the internal state value at the same time. 

`preloadData()` grabs the current data from the form. This is useful when your form can be edited after initial submission. 

`autoSave()` listens to the reactive form value and after a 2000ms debounce will write the form data to the database, as long as all validation rules pass. 

`@HostListener('ngSubmit')` intercepts the form submission and runs the update on the backend. This allows your user to perform a regular save by clicking a button (as opposed to waiting for an auto-save). 

 
```typescript
import { Directive, Input, Output, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { tap, map, take, debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[fireForm]'
})
export class FireFormDirective implements OnInit, OnDestroy {

  // Inputs
  @Input() path: string;
  @Input() formGroup: FormGroup;

  // Internal state
  private _state: 'loading' | 'synced' | 'modified' | 'error';

  // Outputs
  @Output() stateChange = new EventEmitter<string>();
  @Output() formError = new EventEmitter<string>();

  // Firestore Document
  private docRef: AngularFirestoreDocument;

  // Subscriptions
  private formSub: Subscription;

  constructor(private afs: AngularFirestore) { }


  ngOnInit() {
    this.preloadData();
    this.autoSave();
  }

  // Loads initial form data from Firestore
  preloadData() {
    this.state = 'loading';
    this.docRef = this.getDocRef(this.path);
    this.docRef
      .valueChanges()
      .pipe(
        tap(doc => {
          if (doc) {
            this.formGroup.patchValue(doc);
            this.formGroup.markAsPristine();
            this.state = 'synced';
          }
        }),
        take(1)
      )
      .subscribe();
  }

  
  // Autosaves form changes
  autoSave() {
    this.formSub = this.formGroup.valueChanges
    .pipe(
      tap(change => {
        this.state = 'modified';
      }),
      debounceTime(2000),
      tap(change => {
        if (this.formGroup.valid && this._state === 'modified') {
          this.setDoc();
        }
      })
    )
    .subscribe();
  }

  // Intercept form submissions to perform the document write
  @HostListener('ngSubmit', ['$event'])
  onSubmit(e) {
    this.setDoc();
  }


  // Determines if path is a collection or document
  getDocRef(path: string): any {
    if (path.split('/').length % 2) {
      return this.afs.doc(`${path}/${this.afs.createId()}`);
    } else {
      return this.afs.doc(path);
    }
  }

  // Writes changes to Firestore
  async setDoc() {
    try {
      await this.docRef.set(this.formGroup.value, { merge: true });
      this.state = 'synced';
    } catch (err) {
      console.log(err)
      this.formError.emit(err.message)
      this.state = 'error';
    }
  }
  
  // Setter for state changes
  set state(val) {
    this._state = val;
    this.stateChange.emit(val);
  }

  ngOnDestroy() {
    this.formSub.unsubscribe();
  }

}
```

Syncing your reactive forms to Firestore can now be accomplished with a single line of HTML `<form [formGroup]="someForm" fireForm path="someCollection/someId">`. If you have any questions or feedback please leave a comment or drop me a line on Slack. 