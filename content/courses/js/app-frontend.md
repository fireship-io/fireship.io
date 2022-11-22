---
title: Text-to-Image Frontend UI
description: Build a UI for the Text-to-Image Web App
weight: 44
lastmod: 2022-11-11T10:23:30-09:00
draft: false
vimeo: 773543832
emoji: 🍦
video_length: 4:06
quiz: true
---

<quiz-modal options="Array:Object:Map:Set" answer="Map" prize="15">
  <h6>The FormData object is closely related to which built-in JS class?</h6>
</quiz-modal>

## Text-to-Image Frontend Code

First, build out the HTML for the UI. It has a placeholder for the image and a simple form with a single textarea element.


{{< file "html" "index.html" >}}
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <main>
      <h1>AI Photo Generator</h1>
      

      <div id="result">
        Image will appear here
      </div>

      <form>
        <label for="prompt">Prompt</label>
        <textarea name="prompt" maxlength="160"></textarea>

        <button type="submit">Dream</button>
      </form>
    </main>

    <script type="module" src="/main.js"></script>
  </body>
</html>
```

Now we listen to the form submit event and use the browser `fetch` API to send a POST request to our Node server.

{{< file "js" "main.js" >}}
```js
import './style.css';

const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    const response = await fetch('http://localhost:8080/dream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: data.get('prompt'),
      }),
    });

    const { image } = await response.json();

    const result = document.querySelector('#result');
    result.innerHTML = `<img src="${image}" width="512" />`;
});
```

Note: You can find the CSS styles in the [full source code](https://github.com/fireship-io/javascript-course)