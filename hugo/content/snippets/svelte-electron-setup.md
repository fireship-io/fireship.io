---
title: How to Use Svelte with Electron
lastmod: 2020-02-29T06:59:27-07:00
publishdate: 2020-02-29T06:59:27-07:00
author: Jeff Delaney
draft: false
description: Setup Svelte with Electron Forge for Desktop App Development
tags: 
    - svelte
    - electron

type: lessons
youtube: m3OjWNFREJo
code: electron-svelte-boilerplate
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

The following guide demonstrates how to setup Svelte with Electron Forge. The end result is an electron app capable of hot reloading the render process. 

💡 You can skip these steps by manually cloning the [electron-forge-svelte template](https://github.com/codediodeio/electron-forge-svelte) from github. 

{{< figure src="/img/snippets/electron-svelte-hello.png" caption="Svelte running with Electron Forge" >}}


## Step 1 - Generate an Electron Forge App

First, generate an electron forge app.

{{< file "terminal" "command line" >}}
```text
npx create-electron-app my-app
cd my-app
```

## Step 2 - Manually Integrate Svelte & Rollup

At this point, we need to manually add svelte to the project. This guide uses the official [Svelte Template](https://github.com/sveltejs/template) for the source code. Get ready for some surgical copy and pasting... 

1. Delete `index.html` and `index.css` from the `src` directory.
1. Create a `public` folder, then copy the `index.html`, `global.css`, and `favicon.png` from the Svelte Template. 
1. Copy the `src/main.js` and `src/App.svelte` files from the Svelte Template. To avoid confusion with Electron's main process, change the name of `main` to `svelte`. 
1. Copy the `rollup.config.js` file from the svelte template.

### Package.json Setup

Copy the dependencies and and devDependencies from the Svelte Template to your project's package.json. 

{{< file "terminal" "command line" >}}
```text
npm install
npm install concurrently
```

Copy the scripts from Svelte Template, the append `svelte-` to each script name. Next, modify the `start` script to concurrently run svelte and electron. 

{{< file "npm" "package.json" >}}
```json
  "scripts": {
    "start": "concurrently \"npm:svelte-dev\" \"electron-forge start\"",
    "package": "electron-forge package",
    "make": "electron-forge make",
    "publish": "electron-forge publish",
    "lint": "echo \"No linting configured\"",
    "svelte-build": "rollup -c",
    "svelte-dev": "rollup -c -w",
    "svelte-start": "sirv public"
  },
```

### Rollup Modification

Make the following changes to the rollup config file. Update the serve function to call `svelte-start` instead of `start`. 

{{< file "rollup" "rollup.config.json" >}}
```js
export default {
	input: 'src/main.js',  // <-- here
    // ...omitted
}

// 
function serve() { 

    // ...omitted
    require('child_process').spawn('npm', ['run', 'svelte-start', '--', '--dev'], // <-- and here
```

### HTML Modification

Electron resolves paths in your `index.html` relative to the `index.js` main process. Update your the html to use paths relative to the current working directory, i.e `./`. 

{{< file "html" "public/index.html" >}}
```html
<link rel="icon" type="image/png" href="./favicon.png" />
<link rel="stylesheet" href="./global.css" />
<link rel="stylesheet" href="./build/bundle.css" />

<script defer src="./build/bundle.js"></script>
```

### Main Process Modification

Update the path to index.html. 

{{< file "js" "src/index.js" >}}
```javascript
 mainWindow.loadFile(path.join(__dirname, '../public/index.html'));
```

## Step 3 - Enable Live Reload

Enable live reloading with [electron reload](https://www.npmjs.com/package/electron-reload).

{{< file "terminal" "command line" >}}
```text
npm i electron-reload
```

Add the following line in your main process. 

{{< file "js" "src/index.js" >}}
```javascript
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
  awaitWriteFinish: true,
});
```

Expect a delay of approx 2s. 

✔️ All done!
