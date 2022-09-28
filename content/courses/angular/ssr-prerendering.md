---
title: Prerendering 
description: Prerender with Angular Universal using a vanilla JS script
weight: 53
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 359196731
emoji: 📂
video_length: 4:04
---

Create a script that can prerender specific routes using Angular Universal. 

Note, make sure you have enabled Universal with the schematic from the previous video or with `ng add @nestjs/ng-universal`. 

{{< file "terminal" "command line" >}}
```text
npm install --save-dev fs-extra http-server@0.9.0
```

## package.json Scripts

Add the following scripts to your package.json. 

{{< file "npm" "package.json" >}}
```json
    // ...
"scripts": {
    "build:prerender": "npm run build:client-and-server-bundles && node prerender.js",
    "serve:prerender": "http-server dist/browser -c-1"
}
```

## Prerender Script

{{< file "js" "prerender.js" >}}
```js
require('zone.js/dist/zone-node');
require('reflect-metadata');

const { join } = require('path');

const { enableProdMode } = require('@angular/core');

// Import module map for lazy loading
const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');

const { renderModuleFactory } = require('@angular/platform-server');

// leave this as require(), imported via webpack
const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP
} = require(`./dist/server/main`);


const fs = require('fs-extra');

// Must manually define routes to prerender
const ROUTES = [
    '/', 
    '/customers',
    '/customers/78asJMXvM8q7f87cpVEF',
    '/customers/Wu2BRnrAxnizSgGaJXhN',
    '/customers/qe7EtWu4UWiWfZgtmP3C',
    '/kanban',
    '/login',
];


// START prerender script

(async function() {
  enableProdMode();
  // Get the app index
  const views = 'dist/browser';
  const index = await fs.readFile(join(views, 'index.html'), 'utf8');

  // Loop over each route
  for (const route of ROUTES) {
    const pageDir = join(views, route);
    await fs.ensureDir(pageDir);

    // Render with Universal
    const html = await renderModuleFactory(AppServerModuleNgFactory, {
      document: index,
      url: route,
      extraProviders: [provideModuleMap(LAZY_MODULE_MAP)]
    });

    await fs.writeFile(join(pageDir, 'index.html'), html);
  }

  process.exit();
  console.log('prerendering complete');
})();

```