---
title: Unit Testing
description: Test security rules with Node.js
weight: 40
lastmod: 2020-11-20T10:11:30-02:00
draft: false
vimeo: 486557397
emoji: 🧪
chapter_start: Testing 
video_length: 2:49
---

Create the files `test/rules.test.js` and `test/helpers.js`. 

Install [Jest](https://jestjs.io/) and the [Firebase Testing Package](https://www.npmjs.com/package/@firebase/rules-unit-testing). 

{{< file "terminal" "command line" >}}
```bash
npm install --save-dev jest @firebase/rules-unit-testing firebase-admin
```

Add the following script.


{{< file "npm" "package.json" >}}
```json
  "scripts": {
    "test": "jest --env=node --forceExit",
  },
```

