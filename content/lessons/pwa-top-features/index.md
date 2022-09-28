---
title: Seven Awesome PWA Features
lastmod: 2021-01-05T09:31:10-07:00
publishdate: 2021-01-05T09:31:10-07:00
author: Jeff Delaney
draft: false
description: Seven awesome web-platform features you didn't know about.
tags: 
    - javascript
    - pwa

youtube: ppwagkhrZJs
github: https://github.com/fireship-io/7-pwa-features-demo
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Progressive Web Apps (PWA) represent a collection of capabilities that put web apps on a level playing field with native iOS, Android, and desktops apps. The following tutorial implements a 7 lesser-known web features. 

## 1. App Shortcuts

[App Shortcuts](https://web.dev/app-shortcuts/)

{{< file "cog" "manifest.json" >}}
```json
{
    "name": "Fireship",
    //...
    "shortcuts": [
      {
        "name": "Activity Feed",
        "short_name": "Feed",
        "description": "View your activity feed",
        "url": "/feed?utm_source=homescreen",
        "icons": [{ "src": "/icons/feed.png", "sizes": "192x192" }]
      },
      {
        "name": "Recent Comments",
        "short_name": "Comments",
        "description": "View recent comments",
        "url": "/comments?utm_source=homescreen",
        "icons": [{ "src": "/icons/comments.png", "sizes": "192x192" }]
      }
    ]
}
```

## 2. Contact Picker

The [Contact Picker](https://web.dev/contact-picker/) requires an HTTPS connection. If developing locally, use [Ngrok](https://ngrok.com/) to setup an SSH tunnel that can broadcast localhost to a secure URL. 

{{< file "js" "app.js" >}}
```javascript
const btn = document.getElementById('contacts');
btn.addEventListener('click', (event) => getContacts());

const props = ['name', 'email', 'tel', 'address', 'icon'];
const opts = {multiple: true};
const supported = ('contacts' in navigator && 'ContactsManager' in window);

async function getContacts() {

    if (supported) {
        const contacts = await navigator.contacts.select(props, opts);
        console.log(contacts);
    } else {
        alert('contact picker not supported!')
    }

}
```

## 3. Device Motion

[Device Motion](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent)

{{< file "js" "app.js" >}}
```javascript
window.addEventListener('devicemotion', function(event) {
    const el = document.getElementById('motion');
    console.log(event);
    el.innerText = (Math.round((event.acceleration.x + Number.EPSILON) * 100) / 100) + ' m/s2';
    // el.innerText = event.rotationRate.beta;
  });

  window.navigator.geolocation.getCurrentPosition(console.log)
```
## 4. Bluetooth & External Devices

[Bluetooth](https://web.dev/bluetooth/)

{{< file "js" "app.js" >}}
```javascript
const button = document.getElementById('ble');
button.addEventListener('click', (event) => connectBluetooth());

async function connectBluetooth() {

    // Connect Device
    const device = await navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] });
    const server = await device.gatt.connect();

    // Get heart rate data
    const hr = await server.getPrimaryService('heart_rate');
    const hrMeasurement = await hr.getCharacteristic('heart_rate_measurement');

    // Listen to changes on device
    await hrMeasurement.startNotifications(); 

    hrMeasurement.addEventListener('characteristicvaluechanged', (e) => {
        console.log(parseHeartRate(e.target.value));
    });

}
```

## 5. Idle Detection

[Idle Detection](https://web.dev/idle-detection/)

{{< file "js" "app.js" >}}
```javascript
if ('IdleDetector' in window) {

    const idleBtn = document.getElementById('idle');
    idleBtn.addEventListener('click', (event) => runIdleDetection());


    async function runIdleDetection() {
        const state = await IdleDetector.requestPermission();
        console.log(state);

        const idleDetector = new IdleDetector();

        idleDetector.addEventListener('change', () => {
            const { userState, screenState } = idleDetector;
            console.log(idleDetector)
        
            if (userState == 'idle') {
                // update database with status
            }
        });

        await idleDetector.start({
            threshold: 120000,
        });
    }
}
```

## 6. File System

[File System](https://web.dev/file-system-access/)

{{< file "js" "app.js" >}}
```javascript
const getFileBtn = document.getElementById('fs-get')

getFileBtn.onclick = async () => {
    const [handle] = await window.showOpenFilePicker();
    const file = await handle.getFile();
    console.log(file)
};


const saveFileBtn = document.getElementById('fs-save')

saveFileBtn.onclick = async () => {
  const textFile = new File(["hello world"], "hello.txt", {
    type: "text/plain",
  });
  const handle = await window.showSaveFilePicker();
  const writable = await handle.createWritable();
  await writable.write(textFile);
  await writable.close();
};
```

## 7. Web Share

Use the [Share Target API](https://web.dev/web-share-target/) by updating the manifest with a share target:

{{< file "cog" "manifest.json" >}}
```json
{
    "name": "Fireship",
    //...
    "share_target": {
      "action": "/share-photo",
      "method": "POST",
      "enctype": "multipart/form-data",
      "params": {
        "title": "name",
        "text": "description",
        "url": "link",
        "files": [
          {
            "name": "photos",
            "accept": "image/png"
          }
        ]
      }
    },
}
```

Use the [Web Share API](https://web.dev/web-share/) to open a share dialog on the native device: 

{{< file "js" "app.js" >}}
```javascript


const shareBtn = document.getElementById('share');

shareBtn.onclick = async (filesArray) => {
    if (navigator.canShare) {
        navigator.share({
            url: 'https://fireship.io',
            title: 'PWAs are awesome!',
            text: 'I learned how to build a PWA today',
        })
    }
}
```

