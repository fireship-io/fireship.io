---
date: 2018-11-15T08:36:36-07:00
draft: false

title: ExpressJS Middleware
description: Using middleware to apply logic to multiple endpoints
video: https://firebasestorage.googleapis.com/v0/b/fireship-app.appspot.com/o/courses%2Fcloud-functions-master-course%2F2-middleware.mp4?alt=media&token=830c4f9a-74d7-4593-8bbc-3c8cd8ec8259

weight: 9
emoji: 📡
---

{{< file "typescript" "http.ts" >}}
{{< highlight typescript >}}
// Custom Middleware
const auth = (request, response, next) => {
  if (!request.header.authorization) {
    response.status(400).send('unauthorized');
  }
  next();
};

// Multi Route ExpressJS HTTP Function
const app = express();
app.use(cors({ origin: true }));
app.use(auth);
{{< /highlight >}}