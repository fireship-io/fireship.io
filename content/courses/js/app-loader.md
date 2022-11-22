---
title: Loading Spinner
description: Show a loading indicator while the app is fetching data
weight: 45
lastmod: 2022-11-11T10:23:30-09:00
draft: false
vimeo: 773544065
emoji: 🔃
video_length: 1:02
quiz: true
---

<quiz-modal options="active:disabled:hidden:chillin" answer="disabled" prize="16">
  <h6>What state should a button typically be in when the app performing an async operation?</h6>
</quiz-modal>

Let's add a loading indicator to our UI that replaces the text inside the submit button. 

## Loading Code

```js
function showSpinner() {
  const button = document.querySelector('button');
  button.disabled = true;
  button.innerHTML = 'Dreaming... <span class="spinner">🧠</span>';
}

function hideSpinner() {
  const button = document.querySelector('button');
  button.disabled = false;
  button.innerHTML = 'Dream';
}
```