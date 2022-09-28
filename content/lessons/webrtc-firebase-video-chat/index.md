---
title: WebRTC Video Chat on Firebase
lastmod: 2021-03-02T15:10:46-07:00
publishdate: 2021-03-02T15:10:46-07:00
author: Jeff Delaney
draft: false
description: Build a Zoom-like video chat app using WebRTC and Firebase
tags: 
    - webrtc
    - firebase
    - javascript

youtube: WmR9IMUD_CY
github: https://github.com/fireship-io/webrtc-firebase-demo
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

[WebRTC](https://webrtc.org/) facilities realtime audio/video communication on the web using a peer-to-peer protocol, allowing you to build apps like Zoom, Skype, etc.

The following lesson builds a 1-to-1 video chat, where each peer streams directly to the other peer - there is no need for a middle-man server to handle video content. However, a 3rd party server is required for *signaling* that stores shared data for stream negotiation. Firestore is an excellent choice for WebRTC because it is easy to listen to updates to the database in realtime. 

**Additional Resources:**

- [Firebase WebRTC Codelab](https://webrtc.org/getting-started/firebase-rtc-codelab)
- [Demo with Firebase RealtimeDB](https://websitebeaver.com/insanely-simple-webrtc-video-chat-using-firebase-with-codepen-demo)

## How WebRTC Works

It helps to first understand the steps involved in a WebRTC video chat app from the perspective of the caller and callee. 

**👨‍🎤 Caller (Peer 1)**

1. Start a webcam feed
1. Create an 'RTCPeerConnection` connection
1. Call `createOffer()` and write the offer to the database
1. Listen to the database for an answer
1. Share ICE candidates with other peer
1. Show remote video feed

**👩‍🚀 Callee (Peer 2)**

1. Start a webcam feed
1. Create an 'RTCPeerConnection` connection
1. Fetch database document with the offer.  
1. Call `createAnswer()`, then write answer to database. 
1. Share ICE candidates with other peer
1. Show remote video feed


{{< figure src="img/webrtc-diagram.svg" caption="Breakdown of WebRTC signaling process. Source Mozilla" >}}

💡 Mozilla provides an excellent breakdown of the [WebRTC signaling](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling). 

## Initial Setup

Setup a basic JS project using [Vite](https://github.com/vitejs/vite), then install Firebase.

{{< file "terminal" "command line" >}}
```bash
npm init @vitejs/app
npm install firebase
```

Initialize Firebase with Firestore:

{{< file "js" "main.js" >}}
```javascript
import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    // your config
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const firestore = firebase.firestore();
```

## Video Chat Feature

The following code snippets break down the most important concepts when building a video chat feature. Reference the full [source code](https://github.com/fireship-io/webrtc-firebase-demo) for the complete project.

### Peer Connection

Create global variables for the [peer connection](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection) and video streams. Notice how the peer connection makes a reference to STUN servers hosted by Google - a STUN server is used to discover a suitable IP/port candidates for establishing a P2P connection. 

{{< file "js" "main.js" >}}
```javascript
const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

const pc = new RTCPeerConnection(servers);
let localStream = null;
let remoteStream = null;
```

### Local Video Stream

Create a video feed from a webcam using the [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) interface. Add the stream tracks to the peer connection. 

```javascript
webcamButton.onclick = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    // Push tracks from local stream to peer connection
    localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
    });

    // Show stream in HTML video
    webcamVideo.srcObject = localStream;
}
```

### Remote Video Stream

Initialize a remote video feed with an empty stream. Eventually, the stream will be populated when tracks are added to the peer connection.

```javascript
remoteStream = new MediaStream();

// Pull tracks from remote stream, add to video stream
pc.ontrack = event => {
    event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
    });
};

remoteVideo.srcObject = remoteStream;
```

## Signaling

To connect two or more peers via WebRTC, each clientside app needs to provide an ICE (Internet Connectivity Establishment) server configuration. The apps must *signal* to each other how they should connect, which requires a backend server or database (like Firebase). The database allows the peers to relay the required information to establish a connection. 

### Data Model

The database contains a `calls` collection that stores the offer/answer objects from each peer. 

{{< figure src="img/webrtc-firestore-calls.png" caption="Call document in Firestore" >}}

Each call document contains a subcollection for `answerCandidates` and `offerCandidates`. 

{{< figure src="img/webrtc-firestore-candidates.png" caption="Candidates subcollections" >}}

### Create a Call

The caller will reference a new Firestore document with a random ID. The WebRTC peer connection can then create an offer and write the result to the database. 

Once created, the caller will then wait for the document to be updated with an answer from the other user. 

```javascript
callButton.onclick = async () => {
// Reference Firestore collections for signaling
  const callDoc = firestore.collection('calls').doc();
  const offerCandidates = callDoc.collection('offerCandidates');
  const answerCandidates = callDoc.collection('answerCandidates');

  callInput.value = callDoc.id;

  // Get candidates for caller, save to db
  pc.onicecandidate = event => {
    event.candidate && offerCandidates.add(event.candidate.toJSON());
  };

  // Create offer
  const offerDescription = await pc.createOffer();
  await pc.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };

  await callDoc.set({ offer });

  // Listen for remote answer
  callDoc.onSnapshot((snapshot) => {
    const data = snapshot.data();
    if (!pc.currentRemoteDescription && data?.answer) {
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.setRemoteDescription(answerDescription);
    }
  });

  // Listen for remote ICE candidates
  answerCandidates.onSnapshot(snapshot => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const candidate = new RTCIceCandidate(change.doc.data());
        pc.addIceCandidate(candidate);
      }
    });
  });
}
```

### Answer a Call

The process to answer a call is similar, but will reference the existing Firestore document ID, instead of creating a new document. 

```javascript
answerButton.onclick = async () => {
  const callId = callInput.value;
  const callDoc = firestore.collection('calls').doc(callId);
  const offerCandidates = callDoc.collection('offerCandidates');
  const answerCandidates = callDoc.collection('answerCandidates');

  pc.onicecandidate = event => {
    event.candidate && answerCandidates.add(event.candidate.toJSON());
  };

  // Fetch data, then set the offer & answer

  const callData = (await callDoc.get()).data();

  const offerDescription = callData.offer;
  await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await callDoc.update({ answer });

  // Listen to offer candidates

  offerCandidates.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      console.log(change)
      if (change.type === 'added') {
        let data = change.doc.data();
        pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
};
```