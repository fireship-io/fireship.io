---
title: Google Sheets as a Database
lastmod: 2021-06-22T19:13:02-07:00
publishdate: 2021-06-22T19:13:02-07:00
author: Jeff Delaney
draft: false
description: How to use Google Sheets as the primary database for your web app with Next.js
tags: 
    - database
    - nextjs
    - react

youtube: K6Vcfm7TA5U
github: https://github.com/fireship-io/google-sheets-database
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Choosing the right database for your app is difficult. If you have a small project or are just prototyping, [Google Sheets](https://docs.google.com/spreadsheets/) actually works quite nicely as a primary database. It is especially practical for JAM-stack web apps that use server-side rendering. The following tutorial will teach you how to use Google Sheets as a database for [Next.js](https://nextjs.org/). 

⚠️ Be warned... Google Sheets [does not scale](https://medium.com/@eric_koleda/why-you-shouldnt-use-google-sheets-as-a-database-55958ea85d17) like a true production database (because that's not what it is for). It can only store 5 million cells, won't do queries or joins, and has API quotas. 

## Initial Setup

### Create a Spreadsheet

Create a spreadsheet and add some data to it. Make a note of the sheet ID in the URL. 

{{< figure src="img/google-sheet-database.png" caption="Grab Google Sheets Spreadsheet ID" >}}

### Create a Next.js App

💡 This demo uses Next.js, but the process is the same for virtually any **server-side** application. Keep in mind, this code should only run server-side because it requires sensitive auth credentials that shouldn't be exposed client-side. 

Create a next app and install the [googleapis](https://github.com/googleapis/google-api-nodejs-client) package. 


{{< file "terminal" "command line" >}}
```bash
npx create-next-app holy-sheet

cd holy-sheet
npm install googleapis
```

## Sheets API Setup

### Enable the Google Sheets API

From the Google Cloud console, enable the [Google Sheets API](https://developers.google.com/sheets/api).

{{< figure src="img/enable-google-sheets.png" caption="Enable Google Sheets API" >}}

### Get a Service Account Key

Click *manage*, then go to the *credentials* tab. Click on the **App Engine default service account**. 

{{< figure src="img/sheets-service-account.png" caption="Default service account" >}}

From there, click the *Keys* tab and add an new JSON key.

{{< figure src="img/service-account-key.png" caption="Download service account key" >}}

### Save the Key

This will download a JSON file to your system. Save it to the root of the project as `secrets.json`, but do NOT expose it publicly. Add it to gitignore to be safe. 

{{< file "git" ".gitignore" >}}
```bash
secrets.json
```

### Next.js Environment Variables

When performing server-side rending, Next.js will look in the `.env.local` file for environment variables. Create the file and save the path of your service account. 

{{< file "cog" ".env.local" >}}
```bash
GOOGLE_APPLICATION_CREDENTIALS=./secrets.json
SHEET_ID="Sheet ID found on Google Sheets URL"
```

## Google Sheets Database

### Authenticate the API

The `getServerSideProps` function runs on the server (node.js) to fetch data before the HTML is rendered by React. Google will look for the environment variable with the service account and use it to automatically authenticate. We just need to request the Google Sheets scope. 

{{< file "react" "pages/posts/[id].js" >}}
```jsx
import { google } from 'googleapis';

export async function getServerSideProps({ query }) {

    const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });

    const sheets = google.sheets({ version: 'v4', auth });
}

```

### Query the Sheet

Now let's imagine we have a URL like this `posts/:id`, where the ID is a row in the spreadsheet. We get the ID from the URL, then use it to dynamically request a range of cells from the sheet. View more 

{{< file "react" "pages/posts/[id].js" >}}
```jsx
import { google } from 'googleapis';

export async function getServerSideProps({ query }) {

    // auth omitted...

    const { id } = query;
    const range = `Sheet1!A${id}:C${id}`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range,
    });

    const [title, content] = response.data.values[0];
    console.log(title, content)

    return { 
        props: {
            title,
            content
        } 
    }
}

export default function Post({ title, content }) {
    return <article>
        <h1>{title}</h1>
        <div>{content}</div>
    </article>
}
```

Pretty simple! View [examples](https://developers.google.com/sheets/api/guides/values#node.js) in the official docs for more ways to read values from the spreadsheet.
