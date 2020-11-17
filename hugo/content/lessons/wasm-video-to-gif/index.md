---
title: Video to GIF with WASM
lastmod: 2020-11-15T10:14:24-07:00
publishdate: 2020-11-15T10:14:24-07:00
author: Jeff Delaney
draft: false
description: Build a web app the converts video to animated GIF with Web Assembly.
tags: 
    - wasm
    - react
    - javascript

youtube: -OTc0Ki7Sv0
github: https://github.com/fireship-io/react-wasm-gif-maker/
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Web Assembly (WASM) opens the door to building high-performance apps in the browser with languages other than JavaScript. Software normally reserved for installed desktop apps can now run in the browser with near-native performance. The following tutorial demonstrates how to use [FFmpeg.wasm](https://ffmpegwasm.github.io/) to perform CPU-intensive video editing tasks from a frontend react app. 

## Initial Setup

Create a new react app, then install FFmpeg. 

{{< file "terminal" "command line" >}}
```bash
npx create-snowpack-app gifmakr --template @snowpack/app-template-react

npm install @ffmpeg/ffmpeg @ffmpeg/core
```

## GIF Maker App

### Load FFmpeg

The main binary for FFmpeg is loaded asynchronously via a CDN. Load it when the component is initialized with the `useEffect` hook. 

{{< file "react" "App.js" >}}
```jsx
import React, { useState, useEffect } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, [])


  return ready ? () : ( <p>Loading...</p> );
}

export default App;
```

### Preview the Video File

Use a file input to collect a video file, then convert it to a URL with `URL.createObjectURL` so it can be used in video element. 


{{< file "react" "App.js" >}}
```jsx
function App() {
  const [video, setVideo] = useState();


  return ready ? (
      <div className="App">

        { video && <video
            controls
            width="250"
            src={URL.createObjectURL(video)}>

        </video>}

        <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />

        
      </div>

  ) : ( <p>Loading...</p> );
}

export default App;
```

### Convert a Video to GIF

First, the `convertToGif` function below saves the video file to MEMFS where it can be used by FFmpeg. 

Next, it runs a command to perform various video editing and encoding tasks. View the official [FFmpeg docs](https://ffmpeg.org/ffmpeg.html) for a breakdown of available options. 

Lastly, it reads the result and generates a URL where it can be viewed in the browser. 

{{< file "react" "App.js" >}}
```jsx
function App() {

  const [gif, setGif] = useState();

  const convertToGif = async () => {
    // Write the file to memory 
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    // Run the FFMpeg command
    await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif');

    // Read the result
    const data = ffmpeg.FS('readFile', 'out.gif');

    // Create a URL
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    setGif(url)
  }

  return (
     
      <h3>Result</h3>

      <button onClick={convertToGif}>Convert</button>

      { gif && <img src={gif} width="250" />}

    </div>
  )
}

export default App;
```
