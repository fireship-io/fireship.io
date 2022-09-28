---
title: "Introduction to Rxfire Rxjs for Firebase"
lastmod: 2018-08-22T15:22:49-07:00
publishdate: 2018-08-22T15:22:49-07:00
author: Jeff Delaney
draft: false
description: Quick start for the official RxJS bindings for Firebase.
tags: 
    - rxjs
    - firebase

youtube: fq6UPn5H2Bs
github: https://github.com/AngularFirebase/131-rxfire-stencil-todos
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Maintaining async callback-based code is one of the most challenging tasks a developer will face. Over the past few years, [RxJS](http://rxjsdocs.com/) has become the leading tool for reactive programming in JavaScript, so it only makes sense that Firebase would leverage it to make realtime streams more developer-friendly. In the following lesson, you will take an early look at a new officially-supported library called [RxFire](https://www.npmjs.com/package/rxfire). 

## Principles

- Not a replacement for AngularFire2 in Angular projects.
- Ideal for projects using Firebase and RxJS.
- Uses pure functions that return Observables. 
- Makes Lazy Initialization possible.

The first requirement Firebase and RxJS as peer dependencies. 

```shell
npm i rxfire firebase rxjs
```

### Common Techniques

<p class="tip">There is a repo dedicated to [RxFire examples](https://github.com/davideast/rxfire-samples) that you should clone to see it in action in a variety of settings.</p>

Let's start by looking at some isolated examples of the most common tasks you might perform with RxFire. 


**Observe the auth state of the current user**

```js
import { authState } from 'rxfire/auth';
const auth = firebase.auth();

authState(auth).subscribe(user => console.log(`hello ${user.displayName}`))
```

**Query a collection from Firestore and get an array of data & IDs**

The `collectionData` function takes a query, then returns the snapshot mapped to a plain object. You can also get the documument IDs by simply passing a string as the second arg. 

```js
import { collectionData } from 'rxfire/firestore';
const db = firebase.firestore();


const query = db.collection('animals').limit(5);

collectionData(query, 'id').subscribe(animals => console.log(animals));
```

**Upload a File to Firebase Storage**

```js
import { put, getDownloadURL } from 'rxfire/storage';
const storage = firebase.storage();

const ref = storage.ref('images/elephant.png');
const file = new File(...);

// Start the upload
put(ref, file).subscribe();

// Get the Download URL
getDownloadURL(ref).subscribe(url => console.log(url))
```

**Switch to a Different Observable Stream for Relational Data**

Let's imagine we have one document for an Animal and another for its feeding schedule. We need to read that animal's ID before retrieving the food document. 

```js
import { docData } from 'rxfire/firestore';
const db = firebase.firestore();

import { switchMap } from 'rxjs/operators';

const ref = db.doc('animals/elephant');

docData(ref).pipe(
  switchMap(animal => {
    const foodRef = db.doc(`${foods}/${animal.foodId}`);
    return docData(foodRef)
  })
)
.subscribe(food => console.log(food))
```

We only scratched the surface with these examples, but that should give you an idea about how RxFire works. 


## Build Reactive Firebase Web Components with Stencil

[Stencil](https://stenciljs.com/) is an awesome tool from the Ionic team used for composing web components. In fact, Ionic v4 is completely built by Stencil. If you're not familiar with it, don't feel too intimidated - it's the most approachable way to build web components in my opinion.  

Our component is a very basic todo list that requires Google authentication. And because it does not take Firebase as a hard dependency, it can work with any app that uses Firebase by picking up an existing config. 

### Initial Setup

```shell
npm init stencil --run

cd <your-project-name>
npm i rxfire rxjs
npm i -save-dev firebase
```

Our component will expect a Firebase app to be initialized, so let's take care of that in the `index.html`


```html
<head>

  <!-- ...omitted -->
  <script src="https://www.gstatic.com/firebasejs/5.3.0/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/5.3.0/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/5.3.0/firebase-firestore.js"></script>
  <script>
      firebase.initializeApp({
        ...yourWebConfig
      });
      const firestore = firebase.firestore();
      const settings = { timestampsInSnapshots: true };
      firestore.settings(settings);
  </script>
</head>
```

### Google OAuth with RxFire

The `@State` decorator in stencil will re-render the component whenever its value changes. This works really well with RxFire because we can have our Observables tied to the component state, ensuring the latest data is always presented in the UI. 


```js
/// <reference types="firebase" />
declare var firebase: firebase.app.App;

import { Component, State } from '@stencil/core';
import { authState } from 'rxfire/auth';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {

  @State()
  user;

  componentWillLoad() {
    authState(firebase.auth()).subscribe(u => (this.user = u));
  }

  login() {
    var provider = new (firebase.auth as any).GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  logout() {
    firebase.auth().signOut();
  }

  render() {
    if (this.user) {
      return (
        <div>
          You're logged in as {this.user.displayName}
          <button onClick={this.logout}>Logout</button>
        </div>
      );
    } else {
      return (
        <div>
          <button onClick={this.login}>Login with Google</button>
        </div>
      );
    }
  }
}
```

### Adding a ToDo List for the Current User

Let's expand the component by building a todo list for the user. Notice how we use `switchMap` to grab the current users uid, then use it to query Firestore for their associated todo documents. 

```js
// ...
import { collectionData } from 'rxfire/firestore';

import { switchMap } from 'rxjs/operators';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {
  @State()
  todos;

  @State()
  user;

  ref = firebase.firestore().collection('todos');

  componentWillLoad() {
    authState(firebase.auth()).subscribe(u => (this.user = u));

    // Get associated user todos
    authState(firebase.auth())
      .pipe(
        switchMap(user => {
          // Define the query
          if (user) {
            const query = this.ref.where('user', '==', user.uid);
            return collectionData(query, 'taskId');
          } else {
            return [];
          }
        })
      )
      .subscribe(docs => (this.todos = docs));
  }

  addTask(user) {
    this.ref.add({ user: user.uid, task: 'blank task' });
  }

  removeTask(id) {
    this.ref.doc(id).delete();
  }

  render() {
    if (this.user) {
      return (
        <div>
          You're logged in as {this.user.displayName}
          <button onClick={this.logout}>Logout</button>
          <hr />
          <ul>
            {this.todos.map(todo => (
              <li onClick={() => this.removeTask(todo.taskId)}>
                Task ID: {todo.taskId}
              </li>
            ))}
          </ul>
          <button onClick={() => this.addTask(this.user)}>Add Task</button>
        </div>
      );
    } else {
      return (
        <div>
          <button onClick={this.login}>Login with Google</button>
        </div>
      );
    }
  }
}
```

## The End

You just built a reactive fullstack web component that can integrate with any JS framework or Firebase project. Web components and RxJS will play a huge role in the future of the web, and RxFire is a powerful tool for developers building realtime apps. 