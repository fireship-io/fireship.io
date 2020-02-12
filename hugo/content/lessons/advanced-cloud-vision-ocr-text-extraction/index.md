---
title: Extract Text from Images
lastmod: 2018-02-02T15:08:13-07:00
publishdate: 2018-02-02T15:08:13-07:00
author: Jeff Delaney
draft: false
description: Advanced Google Cloud Vision API techniques with Node.js Firebase Cloud Functions
tags: 
    - pro
    - cloud-functions
    - node

pro: true
youtube: KEDeL77_bc4
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---
The following lesson uses the [Cloud Vision API](https://cloud.google.com/vision/) on Google Cloud to extract text from raw images. This is a highly sought after feature in business applications that still work with non-digitized text documents. 

The [Cloud Vision Node.js documentation](https://cloud.google.com/nodejs/docs/reference/vision/0.14.x/v1.ImageAnnotatorClient) is a good reference to keep by your side.


## Getting Started

You actually don't need a frontend app to experiment with this technology - just a Firebase storage bucket. I recommend creating a [dedicated bucket](https://firebase.google.com/docs/storage/web/start#use_multiple_storage_buckets) for the invocation of cloud functions.  

If you're new to functions, you can generate your backend code with the following command: 

```
firebase init functions
## make sure to select TypeScript

cd functions
npm install @google/cloud-vision -s
```

## Google Cloud Vision Advanced Techniques

We're going to explore some a few of the more advanced features in Google Cloud Vision and talk about how you might use them to build an engaging UX. My goal is to give you some inspiration that you can use when building your next app. 

{{< figure src="img/cloud-vision-text-ocr.png" caption="Text extraction demo using Google Cloud Vision" >}}

### Image Text Extraction

Optical Character Recognition, or [OCR](https://en.wikipedia.org/wiki/Optical_character_recognition), is optimized by Google's deep learning algorithms and made available in the API. The response is an array of objects, each containing a piece of extracted text. 

The first element in the response array contains the fully parsed text. In most cases, this is all you need, but you can also get the position of each individual word. It also responds with a bounding box for each object, allowing you to determine where exactly this text appears in the image. 

Inspiration - Build an image-to-text tool as a PWA. 



### Facial Detection

Facial detection, not to be confused with facial recognition, is used to extract data from the people(faces) present in an image. 

The response includes the exact position of every facial feature (eyebrows, nose, etc), which makes it especially useful for positioning an overlay image. Imagine you are an apparel company and you want users to upload an image, then try on different hats or glasses. The Vision API would allow you to position the overlay precisely without much effort. 

Inspiration - Build an app the measures the overall mood of your family photos. 


### Web Detection

Web detection is perhaps the most interesting tool in the Google Vision API. It allows you to tap into Google Image Search from a raw image file, opening the possibility to:

- Find websites using similar images
- Find exact image matches
- Find partial image matches
- Label web entities (similar to image tagging)

Inspiration - Build an app that checks for image copyright infringement or create your own image content discovery engine. 


## Vision API with Cloud Function

Now that we have learned how to handle data from the Vision API, we need to write some server side code to make the actual request. 

Firebase Cloud Functions are just a Node.js environment, so we can use the Vision API client library. It is also possible to make requests to the REST API, but why make life more complicated? 

### index.ts

The cloud function is written in TypeScript, but could easily be modified for vanilla JS (just change the import statements to the `require` syntax). The first step is to initialize the Vision client and point to the specified bucket. From there, we will make several different requests to Cloud Vision to perform our desired tasks. 


```typescript
import * as functions from 'firebase-functions';

// Firebase
import * as admin from 'firebase-admin';
admin.initializeApp();


// Cloud Vision
import * as vision from '@google-cloud/vision';
const visionClient =  new vision.ImageAnnotatorClient();

const bucketName = 'your-bucket-name';



export const imageTagger = functions.storage
    
    .bucket(bucketName)
    .object()
    .onChange( async event => {

            const object = event.data;
            const filePath = object.name;   

            const imageUri = `gs://${bucketName}/${filePath}`;

            const docId = filePath.split('.jpg')[0];

            const docRef  = admin.firestore().collection('photos').doc(docId);


            // Text Extraction
            const textRequest = await visionClient.documentTextDetection(imageUri)
            const fullText = textRequest[0].textAnnotations[0]
            const text =  fullText ? fullText.description : null

            // Web Detection
            const webRequest = await visionClient.webDetection(imageUri)
            const web = webRequest[0].webDetection

            // Faces    
            const facesRequest = await visionClient.faceDetection(imageUri)
            const faces = facesRequest[0].faceAnnotations

            // Landmarks
            const landmarksRequest = await visionClient.landmarkDetection(imageUri)
            const landmarks = landmarksRequest[0].landmarkAnnotations
            
            // Save to Firestore
            const data = { text, web, faces, landmarks }
            return docRef.set(data)
                

});
```


### Showing the Data in the Frontend

Our cloud function saves the response from the function in the Firestore Database. Simply listen to the corresponding document and display its properties as needed. In this example, we unwrap the object observable and display various properties in the UI. 

<img class="content-image" src="/images/cloud-vision-doc.png" alt="Sample response from cloud vision API in firestore" /> 

{{< figure src="img/cloud-vision-doc.png" caption="Data returned from the Cloud Vision API" >}}

```html
<div *ngIf="result$ | async as result">

  <h3>Extracted Text</h3>

  <p>{{ result.text }}</p>

  <h3>Facial Detection</h3>

  <ul>
    <li>Happy? {{ result.faces[0]?.joyLikelihood }} </li>
    <li>Angry? {{ result.faces[0]?.angerLikelihood }} </li>
    <li>Sad? {{ result.faces[0]?.sorrowLikelihood }} </li>
  </ul>

  <h3>Matching Images on the Web</h3>

  <div *ngFor="let img of result.web.partialMatchingImages">
    <img [src]="img.url">
  </div>

</div>
```


## The End

Cloud vision with deep learning is a rapidly evolving technology and is putting new opportunities in the hands of creative developers.  Hopefully this tutorial gives you some inspiration for building next-gen features into your app. 

