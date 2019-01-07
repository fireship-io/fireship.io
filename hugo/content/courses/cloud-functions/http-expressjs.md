---
date: 2018-11-15T08:36:36-07:00
draft: false

title: ExpressJS
description: Complex Routing with ExpressJS
video: https://firebasestorage.googleapis.com/v0/b/fireship-app.appspot.com/o/courses%2Fcloud-functions-master-course%2F2-http-express.mp4?alt=media&token=d476edbb-61b5-4ee5-bd98-bab7e04e8c17

weight: 8
emoji: 📡
---

{{< file "typescript" "http.ts" >}}
{{< highlight typescript >}}
// Multi Route ExpressJS HTTP Function
const app = express();

app.get('/cat', (request, response) => {
  response.send('CAT');
});

app.get('/dog', (request, response) => {
  response.send('DOG');
});

export const api = functions.https.onRequest(app);
{{< /highlight >}}