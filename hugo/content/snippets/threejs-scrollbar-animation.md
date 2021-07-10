---
title: Basic Three.js Scrollbar Animation
lastmod: 2021-05-14T08:51:57-07:00
publishdate: 2021-05-14T08:51:57-07:00
author: Jeff Delaney
draft: false
description: Animate a Three.js scene when the user changes the scroll position.
tags: 
    - threejs

# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

Some of the most visually impressive websites use scroll animations with [Three.js](https://threejs.org/). The following snippet configures a Three.js scene to animate when the user moves the scrollbar. 

## Scene

Setup a basic fullscreen scene using the example from the official docs:

{{< file "js" "app.js" >}}
```javascript
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


```

Make the canvas stay fixed to screen as an animated background. 

{{< file "css" "style.css" >}}
```css
  canvas {
    position: fixed;
    top: 0;
    left: 0;
  }
```

## Overlaying Content 

Overlay the main content with abosolute positioning. It is given an artifically large height value to make it scroll without content. 

{{< file "css" "style.css" >}}
```css
main {
    width: 100vw;
    height: 500vh;
    z-index: 99;
    position: absolute;
  }
```

{{< file "html" "index.html" >}}
```html
<body>
    <main></main>
</body>
```

## Animate on Scroll

Finally, add a cube to the scene and animate it. Listen to the `onscroll` on the body to trigger a change or calculate the next animation position. 

{{< file "js" "app.js" >}}
```javascript
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;

  renderer.render( scene, camera );
}

document.body.onscroll = () => { 
  animate()
  console.log(document.body.offsetTop)
}
```
