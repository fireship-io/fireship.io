---
title: Image Uploads
description: Create an image file uploader with Firebase storage
weight: 44
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 508705711
emoji: 📂
video_length: 4:55
---

## Upload State Changed Event

{{< file "js" "lib/firebase.js" >}}
```javascript
// Storage exports
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;
```

## Image Uploader Component

{{< file "js" "components/ImageUploader.js" >}}
```javascript
import { useState } from 'react';
import { auth, storage, STATE_CHANGED } from '../lib/firebase';
import Loader from './Loader';

// Uploads images to Firebase Storage
export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  // Creates a Firebase Upload Task
  const uploadFile = async (e) => {
    // Get the file
    const file = Array.from(e.target.files)[0];
    const extension = file.type.split('/')[1];

    // Makes reference to the storage bucket location
    const ref = storage.ref(`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
    setUploading(true);

    // Starts the upload
    const task = ref.put(file);

    // Listen to updates to upload task
    task.on(STATE_CHANGED, (snapshot) => {
      const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
      setProgress(pct);

      // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
      task
        .then((d) => ref.getDownloadURL())
        .then((url) => {
          setDownloadURL(url);
          setUploading(false);
        });
    });
  };

  return (
    <div className="box">
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className="btn">
            📸 Upload Img
            <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
          </label>
        </>
      )}

      {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>}
    </div>
  );
}

```