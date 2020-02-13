---
title: Image Thumbnail Resizer Cloud Function
lastmod: 2018-08-09T15:06:22-07:00
publishdate: 2018-08-09T15:06:22-07:00
author: Jeff Delaney
draft: false
description: Build a high-performance image thumbnail generator using a Firebase Storage Cloud Function and Sharp.
tags: 
    - cloud-functions
    - node

youtube: OKW8x8-qYs0
github: https://github.com/AngularFirebase/126-image-resize-storage-cloud-function

# courses
# step: 0

# versions:
#    rxdart: 0.20

---

The single most common Cloud Function use-case for a [storage bucket](https://firebase.google.com/docs/storage/) is to resize images to thumbnails in the background. I've built quite a few of these functions and have developed some techniques to make the process more developer-friendly and performant. The following lesson demonstrates how to resize a Cloud Storage upload to a set of thumbnails using Cloud Functions v2.x. 


{{< figure src="img/after-resize-cloud-function.png" caption="Thumbnails resized by a Firebase Cloud Function" >}}

## Initial Setup

<p class="success">Want to master the fundamentals of serverless? Consider enrolling in the full length [Firebase Cloud Functions Master Course](https://projects.angularfirebase.com/p/firebase-cloud-functions-foundations)</p>

Let's get started by initializing Cloud Functions, then installing the Node SDK for [Google Cloud Storage](https://cloud.google.com/nodejs/docs/reference/storage/1.5.x/) in the functions environment. 

```shell
firebase init functions

cd functions

npm i @google-cloud/storage
```

Working with raw files in a Cloud Function can be challenging, but there are several dependencies we can install to make our life easier. 

### FS Extra

Life is easier when you work with Promise-based APIs in Cloud Functions, so I highly recommend using [fs-extra](https://github.com/jprichardson/node-fs-extra) instead of the built-in Node file system. It mirrors the existing filesystem methods, but uses Promises, allowing us to write cleaner code with `async/await`. 

```shell
npm i fs-extra
```

### Sharp

Next, I am installing a library called [Sharp](http://sharp.dimens.io/en/stable/) to improve performance on image resizing operations. Cloud Functions come with ImageMagick built-in, but it's cumbersome to use and not nearly as fast. Sharp is an easy to use Promise-based package that is about 4x faster than ImageMagick. 

```
npm i sharp
```

## Thumbnail Generator

Now we're ready to build the function. The most difficult part of this function is keeping track of the file paths. We need to (1) download the source file to the function's filesystem, then (2) save the thumbnails to the filesystem, and finally (3) upload the thumbs back to the storage bucket. 

<p class="warn">It is very easy to trigger an infinite loop in a Storage function. In this function, we give our thumbs a special name of `thumb@` and exit the early if this string exists in the file name. Otherwise, each thumb upload would trigger more uploads for ever and ever until the end of time... Leaving us tons of files to delete and a huge Firebase bill.</p>

Here's a breakdown of each important line of code in the function: 

1. Ensure the working directory exists, and if not, create it. This is where we will save local files. 
2. Download the source file from the bucket to the working directory.
3. Map the image sizes into an Array of Promises, using Sharp to generate and save the thumbnail to the working directory. 
4. Run the uploads concurrently with `Promise.all()`
5. Clean up by removing the working files from the function. 

```js
import * as functions from 'firebase-functions';

import * as Storage from '@google-cloud/storage';
const gcs = Storage();

import { tmpdir } from 'os';
import { join, dirname } from 'path';

import * as sharp from 'sharp';
import * as fs from 'fs-extra';

export const generateThumbs = functions.storage
  .object()
  .onFinalize(async object => {
    const bucket = gcs.bucket(object.bucket);
    const filePath = object.name;
    const fileName = filePath.split('/').pop();
    const bucketDir = dirname(filePath);

    const workingDir = join(tmpdir(), 'thumbs');
    const tmpFilePath = join(workingDir, 'source.png');

    if (fileName.includes('thumb@') || !object.contentType.includes('image')) {
      console.log('exiting function');
      return false;
    }

    // 1. Ensure thumbnail dir exists
    await fs.ensureDir(workingDir);

    // 2. Download Source File
    await bucket.file(filePath).download({
      destination: tmpFilePath
    });

    // 3. Resize the images and define an array of upload promises
    const sizes = [64, 128, 256];

    const uploadPromises = sizes.map(async size => {
      const thumbName = `thumb@${size}_${fileName}`;
      const thumbPath = join(workingDir, thumbName);

      // Resize source image
      await sharp(tmpFilePath)
        .resize(size, size)
        .toFile(thumbPath);

      // Upload to GCS
      return bucket.upload(thumbPath, {
        destination: join(bucketDir, thumbName)
      });
    });

    // 4. Run the upload operations
    await Promise.all(uploadPromises);

    // 5. Cleanup remove the tmp/thumbs from the filesystem
    return fs.remove(workingDir);
  });
```

Deploy the function with `firebase deploy --only functions` and then upload a file anywhere in your storage bucket. The initial upload looks like this:


{{< figure src="img/before-resize.png" caption="Image upload prior to resize" >}}

After refreshing the page you should see a series of thumbnails in the same location:


{{< figure src="img/after-resize-cloud-function.png" caption="After resize" >}}


## The End

That's all there is to it. Cloud Storage Functions are often the most challenging to build, but they can be very powerful for features like this. If you're looking to upload files from a client-side app like Angular, checkout the [Drop Zone File Uploader](https://angularfirebase.com/lessons/firebase-storage-with-angularfire-dropzone-file-uploader/)
