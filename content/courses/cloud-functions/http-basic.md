---
date: 2019-02-27T09:32:30-07:00
draft: false

title: HTTP Functions Basics
description: Write your First HTTP Endpoint
video: https://firebasestorage.googleapis.com/v0/b/fireship-app.appspot.com/o/courses%2Fcloud-functions-master-course%2F2-httpbasic.mp4?alt=media&token=cfe63369-6430-4b26-a805-9148e0f13844
vimeo: 320684040
free: true
weight: 7
emoji: 📡
---

{{< file "ts" "http.ts" >}}
```ts
export const basicHTTP = functions.https.onRequest((request, response) => {
  const name = request.query.name;

  if (!name) {
    response.status(400).send('ERROR you must supply a name :(');
  }

  response.send(`hello ${name}`);
});

