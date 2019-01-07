---
title: Deployment
lastmod: 2018-11-15T08:36:36-07:00
draft: false
description: How to Deploy Firebase Cloud Functions
video: https://firebasestorage.googleapis.com/v0/b/fireship-app.appspot.com/o/courses%2Fcloud-functions-master-course%2F1-deploy.mp4?alt=media&token=cd9fb184-68c3-4765-972c-8925e24139bb

weight: 5
emoji: 👶
---

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
firebase deploy --only functions

# or 

firebase deploy --only functions:your-function-name
{{< /highlight >}}
