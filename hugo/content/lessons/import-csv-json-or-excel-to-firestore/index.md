---
title: CSV to Firestore
lastmod: 2018-03-25T17:34:22-07:00
publishdate: 2018-03-25T17:34:22-07:00
author: Jeff Delaney
draft: false
description: Build a Node CLI utility that imports data from a CSV file to Firestore 
tags: 
    - pro
    - firebase
    - firestore
    - node

youtube: vHgBm5anyQI 
github: https://github.com/codediodeio/firestore-migrator
pro: true
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

If you want to migrate your existing database to Firestore, you might be wondering... **How do I import JSON or [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) to [Firestore](https://firebase.google.com/docs/firestore/)?**. In this lesson, I will provide you with a reliable pipeline for reading raw data and parsing it to a writable format for Firestore. 

Everybody has different data modeling needs, so I will teach you how to quickly roll out your own NodeJS CSV-to-Firestore command line import tool. Its purpose is to take your local files (CSV or JSON format in this case), parse it to an array of JS objects, then use the Firebase admin SDK to perform an [atomic batched](https://firebase.google.com/docs/firestore/manage-data/transactions) write. Not only will this handle migrations, but it will also give you a solid development utility that you can extend with additional functionality. 

<p class="tip">CSV format was chosen for this demo because it is commonly used as an export format for relational SQL databases and MS Excel spreadsheets. If you want the opposite, watch episode 69 to learn how to  [export Firestore to CSV](https://angularfirebase.com/lessons/csv-exports-from-firestore-database-with-cloud-functions/). </p>



<div class="basic-anchor">
<p class="tip">Source code available to pro members. <a href="https://angularfirebase.com/pro">Learn more</a></p>
</div>

<div class="pro-basic">
<p class="success">Full source code for the [Firestore migrator CLI tool](https://github.com/codediodeio/firestore-migrator).</p> 
</div>

## Step 1 - Initial Setup

Let's go ahead and create an empty folder and initialized NPM. 

```shell
mkdir firestore-importer
cd firestore-importer
npm init
```

### Setting up a NodeJS TypeScript Project

You can write this utility in vanilla JS, but TypeScript will dramatically improve tooling and productivity long-term. 

```shell
npm install -D typescript
npm install -D @types/node 

touch tsconfig.json

mkdir src
touch src/index.ts
```

Now update your *tsconfig.json* with the following content. Basically, we're just telling TS to compile our code in the /dist folder as *commonjs* that can be understood by NodeJS.

```js
{
    "compilerOptions": {
        "outDir": "./dist/",
        "noImplicitAny": false,
        "module": "commonjs",
        "target": "es5",
        "allowJs": true,
        "sourceMap": true,
        "moduleResolution": "node",
        "lib": [
            "es2015"
        ],
        "types": [
            "node"
        ]
    },
    "include": [
        "src/**/*"
    ]
}
```

At this point, you can run `tsc` from the command line to compile your code. 

### Install the Firebase Admin SDK

```shell
npm install firebase-admin --save
```

You will need to [download your service account](https://firebase.google.com/docs/admin/setup) from the Firebase admin console. Save it in the root of this project and name it *credentials.json*. This will give your local app full access to the project and bypass all security rules.


{{< figure src="img/firebase-service-account.png" caption="Firebase service account" >}}

<p class="warn">Make sure to keep your credentials private. If using git, add the line `credentials.json` to your *.gitignore* file.</p>


### Install Commander

[Commander.js](https://github.com/tj/commander.js/) is a tool that makes it easy to parse command line arguments in Node. We will use it to pass a local file path and Firestore collection path argument to the migration command. 

```shell
npm install commander --save
```

### Install FS Extra and CSVtoJSON

Lastly, let's install [FS Extra](https://github.com/jprichardson/node-fs-extra) to interact with the local file system. When it comes to CSV, there are a bunch of different Node packages, but [CSVtoJSON](https://github.com/Keyang/node-csvtojson) works especially well for this task because it has a callback that emits each row from the spreadsheet as JSON.  

```
npm i --save csvtojson fs-extra
npm i -D @types/{csvtojson,fs-extra}
```

The final initialization logic should look something like this. 

```typescript
#!/usr/bin/env node

import * as admin from 'firebase-admin';
import * as fs from 'fs-extra';
import * as args from 'commander';
import * as csv from 'csvtojson';

var serviceAccount = require("../credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
```


## Step 2 - Parsing Raw Data

Our next step is to read a raw file, then convert it to a JavaScript object that can be used as the document data in Firestore. 

### Reading a JSON File

Reading a raw JSON file is an easy one-liner thanks to fs-extra. 

```typescript
fs.readJSON('hello.json');
```

### CSV to JSON

Reading a CSV is a bit more work. CSVtoJSON uses callbacks, but we will Promisify it in the next section. It gives us a handful of listeners that emit data when a row or document is finished processing. 

```typescript
csv()
  .fromFile(path)
  .on('json', (row) => {
    // emits each row
  })
  .on('end_parsed', (data) => {
    // emits all rows
  })
  .on('error', err => {
    // handle errors
  })
})
```



## Step 3 - Building your own CLI Tool in Node

While it's possible to [process command line arguments in Node](https://nodejs.org/docs/latest/api/process.html#process_process_argv) without any dependencies, I highly recommend the Commander.js package to make life easier for your team. 

Here's how we want our CLI command to work:

```shell
fire-migrate --src bunnies.csv --collection animals
```

It should read the CSV source file, then write each row as a document in Firestore. Accessing arguments from the command is as simple as defining them as an options. 

```typescript
args
.version('0.0.1')
.option('-s, --src <path>', 'Source file path')
.option('-c, --collection <path>', 'Collection path in database')
.option('-i, --id [id]', 'Optional field to use for document ID')
.parse(process.argv);


// Now use the args in your script

const file = args.src;
const colPath = args.collection;
```

As an added bonus, we get instant documentation for the CLI tool. 


```shell
fire-migrate --help
```

{{< figure src="img/cli-help.png" caption="CLI output" >}}

### Full Firebase CLI Code

Now it's time to put everything together into a CLI tool that we can actually use. 

```typescript
#!/usr/bin/env node

import * as admin from "firebase-admin";
import * as csv from "csvtojson";
import * as fs from "fs-extra";
import * as args from "commander";

args
  .version("0.0.1")
  .option("-s, --src <path>", "Source file path")
  .option("-c, --collection <path>", "Collection path in database")
  .option("-i, --id [id]", "Field to use for document ID")
  .parse(process.argv);

// Firebase App Initialization
var serviceAccount = require("../credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Main migration function

async function migrate() {
  try {
    const colPath = args.collection;
    const file = args.src;

    // Create a batch to run an atomic write
    const colRef = db.collection(colPath);
    const batch = db.batch();

    let data;
    if (file.includes(".json")) {
      data = await fs.readJSON(file);
    }

    if (file.includes(".csv")) {
      data = await readCSV(file);
    }

    for (const item of data) {
      const id = args.id ? item[args.id].toString() : colRef.doc().id;

      const docRef = colRef.doc(id);

      batch.set(docRef, item);
    }

    // Commit the batch
    await batch.commit();

    console.log("Firestore updated. Migration was a success!");
  } catch (error) {
    console.log("Migration failed!", error);
  }
}

function readCSV(path): Promise<any> {
  return new Promise((resolve, reject) => {
    let lineCount = 0;

    csv()
      .fromFile(path)
      .on("json", data => {
        // fired on every row read
        lineCount++;
      })
      .on("end_parsed", data => {
        console.info(`CSV read complete. ${lineCount} rows parsed.`);
        resolve(data);
      })
      .on("error", err => reject(err));
  });
}

// Run
migrate();
```

### Compile the Code and Link the Command

To connect our Node executable file to the local command line PATH, we need to register it in the [bin object](https://docs.npmjs.com/files/package.json#bin) in `package.json`. 

```js
  "bin": {
    "fire-migrate": "dist/index.js"
  }
```

You can compile the source code and link the command by running:

```shell
tsc && npm link
```

## The End

As you can see, creating your own CLI tool for Firebase development is pretty simple. You can expand on this code to build additional utilities that increase your development productivity. 
