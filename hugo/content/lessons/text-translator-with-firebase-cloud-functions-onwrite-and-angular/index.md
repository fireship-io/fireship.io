---
title: "Text Translator With Firebase Cloud Functions Onwrite and Angular"
lastmod: 2020-02-10T15:17:21-07:00
publishdate: 2017-06-25T15:17:21-07:00
author: Jeff Delaney
draft: false
description: Translate text in the cloud with Firebase Cloud Functions
tags: 
    - node
    - cloud-functions

youtube: zioTb3Alqz4
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

⚠️ This lesson has been archived! Check out the [Full Angular Course](/courses/angular) for the latest best practices about building a CRUD app. 

<p>In this lesson, we are going to use Firebase Cloud Functions to run code in the background when new data is created in a specific part of the database, using the <a href="https://firebase.google.com/docs/reference/functions/functions.database.RefBuilder#onWrite">onWrite</a> event handler. This will allow us to abstract CPU or memory intensive tasks outside of the frontend Angular app.</p>

<p>We are going to build simple text translator using the <a href="https://cloud.google.com/translate">Google Translate API</a>. The user can paste write something into a textarea, then click the translate button to trigger the function. Running multiple translations client-side would add way too much overhead to our app, so were going to delegate it to a cloud function. </p>

## Building the Translator App

<p>The Angular app is going to use a service to push the user’s initial English text to the database. The component will subscribe to the data and update the translations in realtime when the Google Translate finishes its work. </p>

```shell
 ng g service translate
 ng g component text-translate
```

<p>The NoSQL database structure looks like this. User input must be in english, and translations are correspond to their language code (i.e. fr==French, ar==Arabic)</p>


```
translations
    $translationId
       english: string
       fr: string
       es: string
       ar: string

```


### The Translate Service

<p>Our service has one simple task - Create a new translation in the database and return it as a `FirebaseObjectObservable`.</p>

```typescript
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

@Injectable()
export class TranslateService {

  constructor(private db: AngularFireDatabase) { }


  createTranslation(text: string): FirebaseObjectObservable<any> {
    // create new translation, then return it as an object observable
    const data = { 'english': text }

    const key = this.db.list('/translations').push(data).key

    return this.db.object(`translations/${key}`)
  }


}
```

### The Text Translate Component

<p>Nothing too fancy here, just a `textarea` to accept the user input, then a function that will push it to the database and observe the newly created object. </p>

```typescript
import { Component } from '@angular/core';
import { TranslateService } from '../translate.service';

@Component({
  selector: 'text-translate',
  templateUrl: './text-translate.component.html',
  styleUrls: ['./text-translate.component.scss']
})
export class TextTranslateComponent {

  userText: string;
  currentTranslation;

  constructor(private translateSvc: TranslateService) { }

  handleTranslation() {
    this.currentTranslation = this.translateSvc.createTranslation(this.userText)
  }

  defaultMessage() {
    if (!this.currentTranslation) return "Enter text and click run translation"
    else return "Running translation in the cloud..."
  }



}
```

<p>In the template, we display the translation or say "translation running the cloud" (this could also be replaced with a <a href="http://angularfirebase.com/lessons/show-loading-spinners-for-firebase-data/">loading spinner</a>). </p>

```html
<h1>Translate Your Text</h1>
<textarea  rows="8" cols="40" class="input" [(ngModel)]="userText">
</textarea>

<button (click)="handleTranslation()" class="button is-primary">Run Translation</button>

<h3>French</h3>

{{ (currentTranslation | async)?.fr || defaultMessage() }}

<h3>Spanish</h3>

{{ (currentTranslation | async)?.es || defaultMessage() }}

<h3>Arabic</h3>

{{ (currentTranslation | async)?.ar || defaultMessage() }}
```

## Firebase Cloud Function using onWrite Handler

<p>In order to use Google Translate, you need to active the API from your GCP console.</p>

{{< figure src="img/gcp-translate.png" caption="Enable translate via Google cloud platform" >}}

<p>If this is your first cloud function, run `firebase init`, then select functions.</p>

<p>Go into the `functions/` directory and run `npm install` with the following packages. </p>

```js
{
  "name": "functions",
  "description": "Cloud Functions for Firebase",
  "dependencies": {
    "firebase-admin": "^4.1.2",
    "firebase-functions": "^0.5",
    "lodash": "^4.17.4",
    "request-promise": "^2.0.0"
  },
  "private": true
}
```

<p>The cloud function does all of the heavy lifting. This is a translation microservice - completely isolated from the Angular app. It has its own NodeJS environment and has zero impact on Angular's frontend performance. It is loosely based on the official <a href="https://github.com/firebase/functions-samples/tree/master/message-translation">cloud function sample</a>. </p>

<p>The function is trigged during the `onWrite` event, which occurs when data is changed at the corresponding Firebase database reference point - in this case `/translations/{translationId}`</p>

<p>When triggered, it will take a snapshot of the data, then create a `Promise` for each language we want to translate. Each promise represents a request to the Google Translate API. Google Translate expects a `source` language (english), a `target` language to translate to, and `q` the text to translate. </p>

<p>After the response is received from Google Translate, the Firebase database is updated with the translated data for each language. The Firebase `admin` package is used to overwrite any database rules scoped to the user. </p>

### functions/index.js

```js
var functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

const request = require('request-promise');
const _ = require('lodash');

// List of output languages.
const LANGUAGES = ['es', 'fr', 'ar'];


exports.translate = functions.database.ref('/translations/{translationId}').onWrite(event => {
  const snapshot = event.data;
  const promises = [];


  _.each(LANGUAGES, (lang) => {
      console.log(lang)
      promises.push(createTranslationPromise(lang, snapshot));
   })

  return Promise.all(promises)

});


// URL to the Google Translate API.
function createTranslateUrl(lang, text) {
  return `https://www.googleapis.com/language/translate/v2?key=${firebaseConfig.firebase.apiKey}&source=en&target=${lang}&q=${text}`;
}

function createTranslationPromise(lang, snapshot) {
  const key = snapshot.key;
  const text = snapshot.val().english;
  let translation = {}

  return request(createTranslateUrl(lang, text), {resolveWithFullResponse: true}).then(
      response => {
        if (response.statusCode === 200) {
          const resData = JSON.parse(response.body).data;


          translation[lang] = resData.translations[0].translatedText

          return admin.database().ref(`/translations/${key}`)
              .update(translation);
        }
        else throw response.body;
      });
}
```

{{< figure src="img/translate.gif" caption="Final translation microservice with Firebase Cloud Functions" >}}
