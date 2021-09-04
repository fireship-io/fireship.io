---
title: Migrating from React to Preact in create-react-app
lastmod: 2021-09-03T23:11:49-04:00
author: Finn Krestel
draft: false
description: Speed up your React app by switching to Preact
tags:
  - react
  - node

# youtube:
# code:
# disable_toc: true
# disable_qna: true

# courses
# step: 0

versions:
  "react": 17.0.2

type: lessons
---

[Preact](https://preactjs.com/) is a lightweight 3kB React alternative compatible with React's ecosystem.

## Switching to Preact

### Install node modules

First of all, install all the necessary node modules for this migration.

{{< file "terminal" "command line" >}}
```text
npm install --save preact preact-compat

npm install --save-dev customize-cra react-app-rewired
```

### Configure react-app-rewired

Create a file called `config-overrides.js` at the root of your project and put the following code in it:

{{< file "js" "config-overrides.js" >}}
```javascript
const { override, addWebpackResolve } = require("customize-cra");

// You could use the native methods from react-app-rewired to add the alias, but using customize-cra provides better readability
module.exports = override(
  addWebpackResolve({
    alias: {
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
    },
  })
);
```

The above code adds a webpack alias for react, react-dom/test-utils and react-dom. You can keep react and react-dom installed, but you don't have to.

### Change react scripts

Lastly, modify the start, build, test and eject npm scripts to be the following:

{{< file "npm" "package.json" >}}
```json
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
},
```

## Benefits of Preact

Using Preact instead of React will result in a much smaller bundle size and thinner Virtual DOM. Therefore, the First Contentful Paint will take a shorter amount of time and DOM updates will be faster. Many big companies, such as Groupon, Uber, Pepsi and Domino's choose Preact for their enterprise level web applications. It's also my favourite when I'm building complex sites where performance matters. If you have an existing project, chances are big that Preact will work right out of the box even with React plugins - thanks to it's compatibility layer.
