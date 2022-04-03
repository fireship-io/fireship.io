---
title: Events
description: How to handle events in JSX
weight: 7
lastmod: 2022-02-22T11:11:30-09:00
draft: false
vimeo: 683055453
emoji: 💥
video_length: 1:23
---

## Events in Vanilla JS

{{< file "js" "app.js" >}}
```javascript
const button = document.querySelector('button');

button.addEventListener('click', (event) => {
    console.log(event);
})
```

## Events in React

{{< file "react" "App.js" >}}
```jsx
function Events() {

  return <button onClick={(event => console.log(event))}>Click</button>
}
```

## Challenge

Implement a text input that updates the input value and logs the event target.

<iframe class="frame-full" src="https://stackblitz.com/edit/react-7xn78o?embed=1&file=src/App.js"></iframe>