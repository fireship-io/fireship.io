---
title: Error Handling
description: Handle errors gracefullly on the client and server
weight: 46
lastmod: 2022-11-11T10:23:30-09:00
draft: false
vimeo: 773543578
emoji: 🚨
video_length: 2:28
quiz: true
---

<quiz-modal options="catch():try/catch:throw:just ignore errors" answer="try/catch" prize="18">
  <h6>What is the usual way to handle errors in an async function?</h6>
</quiz-modal>

## Server Error Handling

Errors can happen on the server when the user submits bad data from the form. Let's catch the errors and send a useful message back to the client.

```js
app.post('/dream', async (req, res) => {
  try {
    // main code here
  } catch (error) {
    console.error(error)
    res.status(500).send(error?.response.data.error.message || 'Something went wrong');
  }
});
```

## Frontend Error Handling

When the server fails, we can check the response status and display an error message to the user.

```js
const response = await fetch(...);

if (response.ok) {
    // main code here
} else {
    const err = await response.text();
    alert(err);
    console.error(err);
}
```