---
title: Firebase Cloud Functions Setup
lastmod: 2018-11-15T08:36:36-07:00
draft: false
description: How to setup a Firebase Cloud Functions environment with TypeScript
video: https://firebasestorage.googleapis.com/v0/b/fireship-app.appspot.com/o/courses%2Fcloud-functions-master-course%2F1-install.mp4?alt=media&token=c0bca07e-4936-48cb-a8c7-58a0131c8075

weight: 3
emoji: 👶
---

Installation and setup is identical for Mac, Windows, and Linux. The only requirement is NodeJS which is likely available on your system, but if not, install NVM https://github.com/creationix/nvm. 

## Install Node

Cloud functions in either Node 6 or 8, so it is recommended that you setup your local env with. For example, with NVM

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
nvm install 8
nvm use 8
{{< /highlight >}}


## Setup Cloud Functions


{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
npm install firebase-tools -g

firebase login

firebase init functions

cd functions
{{< /highlight >}}



{{% box icon="hazard" class="box-red" %}}
### Common Issue on Windows
Incorrect environment path on windows https://github.com/firebase/firebase-tools/issues/610
{{% /box %}}