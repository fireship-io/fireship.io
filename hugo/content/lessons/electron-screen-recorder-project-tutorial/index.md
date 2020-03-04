---
title: Electron Screen Capture Tutorial
lastmod: 2020-03-04T06:56:47-07:00
publishdate: 2020-03-04T06:56:47-07:00
author: Jeff Delaney
draft: false
description: Build an Electron App that can capture and record video files from your desktop. 
tags: 
    - electron
    - javascript
    - node

youtube: 3yqDxhR2XxE
github: https://github.com/fireship-io/223-electron-screen-recorder
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---


Electron opens the world of desktops apps to the average JavaScript developer. It wraps [Chromium](https://www.chromium.org/Home) with Node.js, providing a browser for building UIs and Node for low-level system operations. 

The following project tutorial demonstrates how to build a simple screen recorder with Electron. The app can retrieve the available screens from the system, turn the screen into a video feed, then record and save the raw video file to the system. 

<div class="vid vid-center">
{{< vimeo 395439129 >}}
</div>

## Initial Setup

### Electron Forge

Create a new app with [Electron Forge](https://www.electronforge.io/) - it provides a solid starting point for building and distributing the app. 

{{< file "terminal" "command line" >}}
```text
npx create-electron-app my-app

cd my-app
npm start
```

💡 Tip - Enter `rs` into the terminal to restart the app after making code changes. 

### HTML Markup

The HTML contains a `<video>` element to preview the output from a screen and provides buttons to start/stop recording.

{{< file "html" "index.html" >}}
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Simple Screen Recorder</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css"
    />
    <link rel="stylesheet" href="index.css" />
    <script defer src="render.js"></script>
  </head>
  <body class="content">
    <h1>⚡ Electron Screen Recorder</h1>

    <video></video>

    <button id="startBtn" class="button is-primary">Start</button>
    <button id="stopBtn" class="button is-warning">Stop</button>

    <hr />

    <button id="videoSelectBtn" class="button is-text">
      Choose a Video Source
    </button>
  </body>
</html>
```

### Include Node in Electron's Render Process

In order to use Node in Electron's frontend render process, we need to need to add the following config option: 

{{< file "js" "index.js" >}}
```javascript
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {        /// <-- update this option
      nodeIntegration: true
    }
  });
```

## Screen Recorder

Create a file named `src/render.js`. All code in this section runs in this file. 

### Get Available Screens

How do we access the available windows or screens to record? Electron has a built-in [desktopCapturer](https://www.electronjs.org/docs/api/desktop-capturer) that returns a list of the user's screens.  

{{< file "js" "render.js" >}}
```javascript
const videoSelectBtn = document.getElementById('videoSelectBtn');
videoSelectBtn.onclick = getVideoSources;

const { desktopCapturer, remote } = require('electron');
const { Menu } = remote;

// Get the available video sources
async function getVideoSources() {
  const inputSources = await desktopCapturer.getSources({
    types: ['window', 'screen']
  });
}

```


### Display a Popup Menu

At this point we have a list of screens, but need a UI element for the user to select one. This is a good use-case for a popup menu. 

```javascript
const { desktopCapturer, remote } = require('electron');
const { Menu } = remote;

async function getVideoSources() {
  const inputSources = await desktopCapturer.getSources({
    types: ['window', 'screen']
  });

  const videoOptionsMenu = Menu.buildFromTemplate(
    inputSources.map(source => {
      return {
        label: source.name,
        click: () => selectSource(source)
      };
    })
  );


  videoOptionsMenu.popup();
}
```

### Preview Video Stream

Once a screen is selected it should be previewed in the video element. The code below uses `navigator.mediaDevices.getUserMedia` to turn the screen into a raw video feed. 

A MediaRecorder instance is created to record the stream as a `webm` video file that can be played back.  

```javascript
let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];

// Change the videoSource window to record
async function selectSource(source) {

  videoSelectBtn.innerText = source.name;

  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id
      }
    }
  };

  // Create a Stream
  const stream = await navigator.mediaDevices
    .getUserMedia(constraints);

  // Preview the source in a video element
  videoElement.srcObject = stream;
  videoElement.play();

  // Create the Media Recorder
  const options = { mimeType: 'video/webm; codecs=vp9' };
  mediaRecorder = new MediaRecorder(stream, options);

  // Register Event Handlers
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;
}

```

### Record and Save a Video File

The final step is to give the user control over the recording and saving of a video file. 

```javascript
const { writeFile } = require('fs');
const { dialog, Menu } = remote;

const startBtn = document.getElementById('startBtn');
startBtn.onclick = e => {
  mediaRecorder.start();
  startBtn.classList.add('is-danger');
  startBtn.innerText = 'Recording';
};

const stopBtn = document.getElementById('stopBtn');

stopBtn.onclick = e => {
  mediaRecorder.stop();
  startBtn.classList.remove('is-danger');
  startBtn.innerText = 'Start';
};


// Captures all recorded chunks
function handleDataAvailable(e) {
  console.log('video data available');
  recordedChunks.push(e.data);
}

// Saves the video file on stop
async function handleStop(e) {
  const blob = new Blob(recordedChunks, {
    type: 'video/webm; codecs=vp9'
  });

  const buffer = Buffer.from(await blob.arrayBuffer());

  const { filePath } = await dialog.showSaveDialog({

    buttonLabel: 'Save video',
    defaultPath: `vid-${Date.now()}.webm`
  });

  console.log(filePath);

  writeFile(filePath, buffer, () => console.log('video saved successfully!'));
}

```