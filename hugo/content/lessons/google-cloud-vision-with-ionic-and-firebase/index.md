---
title: Google Cloud Vision with Ionic - Not Hotdog App
lastmod: 2018-01-24T15:00:49-07:00
publishdate: 2018-01-24T15:00:49-07:00
author: Jeff Delaney
draft: false
description: Build the Not Hotdog app (Silicon Valley) using Ionic, Firebase, and Google Cloud Vision. 
tags: 
    - ionic
    - gcp
    - ml
    - firebase

youtube: taPczl94Eow
github: https://github.com/AngularFirebase/83-ionic-not-hotdog
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

In this lesson, we're going to combine Google's [Google's Cloud Vision API](https://cloud.google.com/vision/) with [Ionic](https://ionicframework.com/docs/) and [Firebase](https://firebase.google.com/) to create a native mobile app that can automatically label and tag images. But most importantly, it can determine if an image is a [hotdog or not](https://www.engadget.com/2017/05/15/not-hotdog-app-hbo-silicon-valley/) - just like the SeeFood app that made Jin Yang very rich. 

<p class="success">Just a few years ago, this technology would have been unreachable by the average developer. You would need to train your own deep neural network on tens-of-thousands of images with massive amounts of computing power. Today, you can extract all sorts of data from images with the Cloud Vision API, such as facial detection, text extraction, landmark identification, and more.</p>


{{< figure src="img/hotdog-ionic-vision.gif" caption="Demo of Not Hotdog App in Ionic" >}}

Although the premise is silly, this app is no joke. You will learn how to implement very powerful deep learning image analysis features that can be modified to perform highly useful tasks based on AI computer vision. 

## *SeeFood* App Design

Not only will we determine if an object is a hotdog, but we will also show all 10 labels that Cloud Vision detects. The entire process can be broken down into the following steps.

1. User uploads an image to Firebase storage via AngularFire2 in Ionic.
2. The upload triggers a storage cloud function. 
3. The cloud function sends the image to the Cloud Vision API, then saves the results in Firestore. 
4. The result is updated in realtime in the Ionic UI. 

## Initial Setup

You are going to be **amazed at how easy this app is to build**. In just a few minutes, we go from zero to a native mobile app powered by cutting edge machine learning technology. 

### Create a Firebase Project and Enable Cloud Vision

This goes without saying, but you need a Firebase project. Every Firebase project just a Google Cloud Platform project under the hood, from which we can enable additional APIs as needed. Start by installing Firebase CLI tools.

```shell
npm install firebase-tools -g
```

The Cloud Vision API is not enabled by default. From the GCP console, navigate the the *enable APIs* and [enable the vision API](https://console.cloud.google.com/apis/library/vision.googleapis.com/). 


{{< figure src="img/vision-enable.png" caption="Enable cloud vision from the GCP console" >}}

### Initialize an Ionic Project with AngularFire

At this point, let's generate a new Ionic app using the blank template. 

```shell
ionic start visionApp blank
cd visionApp
```

### Emulating an iOS or Android Device

This tutorial uses the Ionic cordova plugin that will only work on **native mobile devices**. 

Modifying this code to work with a progressive web app is pretty easy. The cloud function is identical, you just need a different method for collecting files from the user. Luckily, I showed you how to [upload images from a PWA](https://angularfirebase.com/lessons/firebase-storage-with-angularfire-dropzone-file-uploader/). 

## Google Vision Cloud Function

We're going to use a storage cloud function trigger to send the file off to the Cloud Vision API.  After the file upload is complete, we just need to pass the stored file's bucket URI (looks like `gs://<bucket>/<file>`) to the Cloud Vision, which responds with an object of labels about the image.

After we receive this response, it will be formatted to an array of labels and saved in Firestore NoSQL database to be consumed by the end user in Ionic. 

<p class="success">Pro Tip - Firebase storage functions cannot be scoped to specific files or folders. I recommend creating an isolated bucket for any file uploads that trigger functions. </p>

### Initialize Cloud Functions in Ionic

Make sure that you're using TypeScript in your functions environment. Here are the steps if starting from scratch

```shell
firebase init functions
cd functions

npm install @google/cloud-vision -s
```

### index.ts

Our Cloud Function is `async`, which just means that it should return a `Promise`. Here's a step by step breakdown of how it works. 

1. User uploads photo, automatically invoking the function.
2. We format the image URI and send it to th  Cloud Vision API. 
3. Cloud Vision responds with data about the image
4. We format and save this data into the Firestore database. 

The user will be subscribed to this data in the Ionic frontend, making the labels magically appear on their device when the function is complete. 

```typescript
import * as functions from 'firebase-functions';

// Firebase
import * as admin from 'firebase-admin';
admin.initializeApp();


// Cloud Vision
import * as vision from '@google-cloud/vision';
const visionClient =  new vision.ImageAnnotatorClient();

// Dedicated bucket for cloud function invocation
const bucketName = 'firestarter-96e46-vision';

export const imageTagger = functions.storage
    
    .bucket(bucketName)
    .object()
    .onChange( async event => {

            // File data
            const object = event.data;
            const filePath = object.name;   

            // Location of saved file in bucket
            const imageUri = `gs://${bucketName}/${filePath}`;

            const docId = filePath.split('.jpg')[0];

            const docRef  = admin.firestore().collection('photos').doc(docId);

            // Await the cloud vision response
            const results = await visionClient.labelDetection(imageUri);

            // Map the data to desired format
            const labels = results[0].labelAnnotations.map(obj => obj.description);
            const hotdog = labels.includes('hot dog')


            return docRef.set({ hotdog, labels })           
});
```

The end result is a firestore document that looks something like this: 

{{< figure src="img/firestore-vision-data.png" caption="Cloud Vision data" >}}

## Ionic App


We're starting from a brand new Ionic app with the blank template. We really only need one component to make this app possible. Make sure you're back in the Ionic root directory and generate a new page. 

```shell
ionic g page vision
```


Then inside the `app.component.ts`, use the vision page as your Ionic root page. 

```typescript
import { VisionPage } from '../pages/vision/vision';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = VisionPage;
  // ...omitted
}
```

### Installing AngularFire2 and Dependencies

Let's add some dependencies to our Ionic project

```shell
npm install angularfire2 firebase --save

ionic cordova plugin add cordova-plugin-camera
npm install --save @ionic-native/camera
```

At this point we need to register [AngularFire2](https://github.com/angular/angularfire2) and the[ native camera plugin](https://ionicframework.com/docs/native/camera/) in the `app.module.ts`. My full app module looks like this (make sure to add your own Firebase project credentials): 

```typescript
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { VisionPage } from '../pages/vision/vision';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { Camera } from '@ionic-native/camera';


const firebaseConfig = {
 // your config here
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    VisionPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    VisionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera
  ]
})
export class AppModule {}
```

### Uploading Files in Ionic with AngularFire2

There's quite a bit going on in the component, so let me break this down step by step. 

1. The user clicks `uploadAndCapture()` to bring up the device camera. 
2. The camera returns the image as a Base64 string.
3. We generate an ID that is used for both the image filename and the firestore document ID. 
4. We listen to this location in Firestore. 
5. An upload task is created to transfer the file to storage. 
6. We wait for the cloud function to update Firestore. 
7. Done.


```typescript
import { Component } from '@angular/core';
import { IonicPage, LoadingController, Loading } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { tap, filter } from 'rxjs/operators';

import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFirestore} from 'angularfire2/firestore';

import { Camera, CameraOptions } from '@ionic-native/camera';


@IonicPage()
@Component({
  selector: 'page-vision',
  templateUrl: 'vision.html',
})
export class VisionPage {

  // Upload task
  task: AngularFireUploadTask;

  // Firestore data
  result$: Observable<any>;

  loading: Loading;
  image: string;

  constructor(private storage: AngularFireStorage, 
              private afs: AngularFirestore, 
              private camera: Camera,
              private loadingCtrl: LoadingController) {

                this.loading = this.loadingCtrl.create({
                  content: 'Running AI vision analysis...'
                });
  }


  startUpload(file: string) {

    // Show loader
    this.loading.present();

    // const timestamp = new Date().getTime().toString();
    const docId = this.afs.createId();

    const path = `${docId}.jpg`;

    // Make a reference to the future location of the firestore document
    const photoRef = this.afs.collection('photos').doc(docId)
    
    // Firestore observable, dismiss loader when data is available
    this.result$ = photoRef.valueChanges()
        .pipe(
          filter(data => !!data),
          tap(_ => this.loading.dismiss())
        );

    
    // The main task
    this.image = 'data:image/jpg;base64,' + file;
    this.task = this.storage.ref(path).putString(this.image, 'data_url'); 
  }

  // Gets the pic from the native camera then starts the upload
  async captureAndUpload() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    const base64 = await this.camera.getPicture(options)

    this.startUpload(base64);
  }

}
```

### Vision Page HTML

We need a button to open the user's camera and start the upload.

```html
<button ion-button icon-start (tap)="captureAndUpload()">
    <ion-icon name="camera"></ion-icon>
    Activate Cloud Vision
</button>

```

Then we need to unwrap the results observable. If `hotdog === true`, then we know we've got ourselves a hotdog and can update the UI accordingly. In addition, we loop over the labels to display an ionic chip for each one. 

```html
 <ion-col *ngIf="result$ | async as result">

  <h3>Hotdog?</h3>

  <button *ngIf="result.hotdog"
            color="secondary"ion-button full>

    Hotdog!!!
  </button>

  <button *ngIf="!result.hotdog"
            color="danger"ion-button full>
  
    Not Hotdog :)
  </button>

  <h3>Labels</h3>

  <ion-chip color="secondary"
          *ngFor="let label of result.labels">
          
          <ion-label>{{ label }}</ion-label>
        
  </ion-chip>
    
</ion-col>
```


## Next Steps

I see a huge amount of potential for mobile app developers with the Cloud Vision API. There are many business applications that can be improved with AI vision analysis, which I plan on covering in a future advanced lesson where we dive deeper into the API's full capabilities. 