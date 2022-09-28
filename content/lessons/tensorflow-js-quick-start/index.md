---
title: TensorFlow.js Quick Start Tutorial
lastmod: 2018-03-31T13:25:17-07:00
publishdate: 2018-03-31T13:25:17-07:00
author: Jeff Delaney
draft: false
description: Get started with TensorFlow.js by building machine learning models in a JavaScript app
tags: 
    - ml
    - tensorflow
    - javascript

youtube: Y_XM3Bu-4yc
github: https://github.com/AngularFirebase/97-tensorflowjs-quick-start
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---
Google launched [TensorFlow.js](https://js.tensorflow.org/) at TensorFlow Dev Summit 2018, which opens the door to building machine learning (ML) models in the browser. This means web developers can do things like...

1. Build privacy-friendly AI features. Data never leaves the client, so you can build deep learning models without ever seeing the actual data. 
2. Use pre-trained Python ML models in your app. There are tons of successful Python-based models that you can load into the browser and start running predictions with minimal code.
3. Train ML models in Firebase Cloud Functions (when NodeJS support lands in the library). 
4. And probably tons of other things that creative developers will figure out.  

In this lesson, we will (1) build and train a simple linear regression model from scratch and (2) import a [digit recognizer](https://www.kaggle.com/c/digit-recognizer) model trained in Python to make predictions from our JavaScript app. 


{{< figure src="img/tfjs-mnist-demo.gif" caption="MNIST digit recognizer web app using TensorFlow.js" >}}

## Why should I care about TensorFlow? 

TensorFlow is an incredible tool for performing and distributing mathematical operations, but without a background in ML and access to high quality data, it will be rendered completely useless to you. It is not magic. A successful algorithm is often the result of many, many hours of data preparation, exploratory analysis, and experimentation. 

But I have good news... You can use *pre-trained* models from the highly-popular [Keras](https://keras.io/) Python library to make predictions. So you don't need to be a data scientist with a PhD to build futuristic ML-powered apps. 

My primary goal is to get you up and running with TensorFlow.js on the web. If you're interested in this field, I highly recommend spending a few days taking the [Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course/) and be sure to watch the TF.js  announcement video below.
<div class="videoWrapper">
<iframe width="560" height="315" src="https://www.youtube.com/embed/YB-kfeNIPCE" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>

## Build an App

First, we need an app to serve on the web. Naturally, I will be using the [Angular CLI](https://cli.angular.io/) to generate an app, but you can use the TensorFlow code in this lesson with any JavaScript web app. 

<p class="info">I am intentionally leaving out the code for the chart and drawable canvas directive that you see in the video, but you can find it in the [source code](https://github.com/AngularFirebase/97-tensorflowjs-quick-start/blob/master/src/app/drawable.directive.ts). </p> 


### Step 1 - Generate an Angular App

```shell
npm install -g @angular/cli
ng new tensorflowApp
```

### Step 2 - Install Tensorflow.js

```shell
cd tensorflowApp
npm install @tensorflow/tfjs --save
```

## Train a Basic TensorFlow.js Linear Model

In the following section I will show you how to build, train, and make predictions with TensorFlow.js. Our ML model is just a simple [linear regression](https://en.wikipedia.org/wiki/Linear_regression) that takes a 1-dimensional value as its input and attempts to fit a straight line to the dataset.

{{< figure src="img/linear-regression.png" caption="Regression demo" >}}

After the model is trained, we will show the user a form input that will make a new prediction when the value changes. 


{{< figure src="img/angular-tensorflow-train.gif" caption="Linear model demo" >}}
### Step 3 - Import TensorFlow.js

I will be writing all the code in `app.component.ts`. Notice how we are calling the `train()` method when the component is initialized. 

```typescript
import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Component({...})
export class AppComponent implements OnInit {

  linearModel: tf.Sequential;
  prediction: any;

  ngOnInit() {
    this.train();
  }


  async train() {
    // todo
  }

  predict(val) {
    // todo
  }
```

### Step 4 - Build a Machine Learning Model

Machine learning models are trained by iterating over batches of samples and slowly optimizing the prediction. Most neural networks use some variation of [gradient descent](http://ruder.io/optimizing-gradient-descent/) as an optimizer - we're using Stochastic Gradient Descent (SGD) to minimize the Mean Squared Error (MSE). This is a highly complex area that could fill an entire book. 


```typescript
  async train(): Promise<any> {
      // Define a model for linear regression.
    this.linearModel = tf.sequential();
    this.linearModel.add(tf.layers.dense({units: 1, inputShape: [1]}));

    // Prepare the model for training: Specify the loss and the optimizer.
    this.linearModel.compile({loss: 'meanSquaredError', optimizer: 'sgd'});


    // Training data, completely random stuff
    const xs = tf.tensor1d([3.2, 4.4, 5.5]);
    const ys = tf.tensor1d([1.6, 2.7, 3.5]);


    // Train
    await this.linearModel.fit(xs, ys)

    console.log('model trained!')
  }
```

<p class="tip">What the hell is a tensor? There's no easy explanation, but just think `Tensor === Array`. It's really just an abstraction of a multi-dimensional array for doing math in TensorFlow. If you want a detailed physical explanation, watch this professor's <a href="https://youtu.be/f5liqUk0ZTw">breakdown</a>.</p>

### Step 5 - Make a Prediction with the Model

Now that our model is trained, we can feed it values to make predictions. TensorFlow runs in the context of a session, so we need to call `dataSync` on the Tensor value to extract the data out into something usable in JavaScript. 


```typescript
predict(val: number) {
  const output = this.linearModel.predict(tf.tensor2d([val], [1, 1])) as any;
  this.prediction = Array.from(output.dataSync())[0]
}
```

We can run this method as an event handler when the file of an HTML form input changes. 

```html
TensorFlow says {{ prediction }}

<input type="number" (change)="predict($event.target.value)">
 ```

## How to use Pre-Trained Python Keras Models

Training a model can be extremely CPU and memory intensive - that's why most models are trained on [high-powered GPUs](https://www.nvidia.com/en-us/data-center/dgx-saturnv/) that can distribute billions of matrix multiplication operations efficiently. 

Fortunately, we can use pre-trained models to bypass this step completely. This means we can skip straight to the fun part - making predictions. You can find models for a sorts of different applications on [Kaggle Kernels](https://www.kaggle.com/kernels). 

In the steps below, we will convert a Keras-based Convolutional Neural Network into a model that predicts the value of a handwritten digit from the famous [MNIST dataset](https://en.wikipedia.org/wiki/MNIST_database). 

### Step 6 - Convert a Keras Model to TensorFlow.js

TensorFlow.js has a Python CLI tool that converts an `h5` model saved in Keras to a set files that can be used on the web. Install it by running:

```
pip install tensorflowjs
```

At this point, you will need to have a Keras model saved on your local system. If you clone the project for this lesson, you can run the following command to generate your model. 

```shell
tensorflowjs_converter --input_format keras \
                       keras/cnn.h5 \
                       src/assets
```

Currently, I am saving the output in the assets folder of the Angular app, but TF can also read from a URL, so you can also save your model files in a cloud storage bucket. 

### Step 7 - Load the Model

Now we load the model with a simple one-liner. 


```typescript
  async loadModel() {
    this.model = await tf.loadModel('/assets/model.json');
  }
```

### Step 8 - Make Predictions from Image Data

Now that our model is loaded, it is expecting 4-dimensional image data in a shape of `[any, 28, 28, 1]` - that translates into *batchsize*, *width pixels*, *height pixels*, and *color channels*. An even simpler way to think about it is just an array of images with a single color channel. 

We run our predictions inside of [tf.tidy](https://js.tensorflow.org/api/latest/index.html#tidy) to clean up the intermediate memory allocated to the tensors. Basically, we are just trying to avoid memory leaks. 

TensorFlow.js gives us a `fromPixels` helper to convert an [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData) HTML object into a Tensor. You can also use a plain `HTMLImageElement` or even a video. Under the hood it turns the pixels into a 3D matrix of numbers. 

```typescript
  async predict(imageData: ImageData) {

    await tf.tidy(() => {

      // Convert the canvas pixels to a Tensor of the matching shape
      let img = tf.fromPixels(imageData, 1);
      img = img.reshape([1, 28, 28, 1]);
      img = tf.cast(img, 'float32');

      // Make and format the predications
      const output = this.model.predict(img) as any;

      // Save predictions on the component
      this.predictions = Array.from(output.dataSync()); 
    });

  }
  ```

The result of this method is an Array of 10 values that add up to a total of 1, which is a prediction function known as [softmax](https://en.wikipedia.org/wiki/Softmax_function). We can use the index with highest probability as the prediction for the digit.

Given the prediction below, the model interprets the image drawn on the canvas is a value of 2 with 93% confidence.

```js
[0.02, 0.003, 0.93, ...]
```

## The End

Building and training machine learning models in the browser ushers in a whole new set of possibilities for web developers. I'm excited to see what people create with TensorFlow.js and hope this guide helps kickstart your project. If you want to see more advanced TensorFlow content, let me know in the comments or on Slack. 
