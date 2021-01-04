---
title: SendGrid Transactional Email Guide
lastmod: 2019-07-05T10:26:00-07:00
publishdate: 2019-07-05T10:26:00-07:00
author: Jeff Delaney
draft: false
description: Send emails from your app using SendGrid's transactional email API with Node and Cloud Functions
tags: 
    - mvp
    - firebase
    - cloud-functions
    - node

youtube: vThujL5-fZQ
github: https://github.com/fireship-io/196-sendgrid-email-cloud-functions
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

[Transactional email](https://postmarkapp.com/blog/what-is-transactional-email-and-how-is-it-used) is the art of communicating with users in response to events or conditions, and is an important consideration for the overall user experience (UX) of an app. One of the most popular email APIs is [SendGrid](https://sendgrid.com/) (recetly acquired by Twilio). It is flexible, provides a NodeJS SDK, and starts with free tier for small projects. The following lesson will teach you how to send email from your app based on user-driven events with [Firebase Cloud Functions](https://firebase.google.com/docs/functions). 

Common use-cases for transactional email include:

- Send a welcome email after signup. 
- Send a email via HTTP request (completely dynamic based on frontend logic). 
- Send an email on a Firestore database update. For example, "user A" comments on a post from "user B", triggering a email to user B. 
- Send email on a specific time interval i.e. weekly account summary. 


{{< box icon="scroll" class="box-blue" >}}
This post first appeared as [Episode 71 SendGrid V3 on AngularFirebase.com](https://angularfirebase.com/lessons/sendgrid-v3-nodejs-transactional-email-cloud-function/) and has been fully updated with the latest best practices. 
{{< /box >}}


## Frontend Integrations

This lesson is integrated with multiple frontend frameworks. Choose your favorite flavor 🍧. 

<nav>
    {{< mvp-chapter name="angular" link="/snippets/sendgrid-angular" >}}
    {{< mvp-chapter name="react" link="/snippets/sendgrid-react" >}}
    {{< mvp-chapter name="vue" link="/snippets/sendgrid-vue" >}}
    {{< mvp-chapter name="svelte" link="/snippets/sendgrid-svelte" >}}
    {{< mvp-chapter name="flutter" link="/snippets/sendgrid-flutter" >}}
</nav>

## Initial Setup

### Initialize Cloud Functions

First, initialize Cloud Functions in your project with the Firebase Tools CLI. I recommend using TypeScript, but it is optional for this lesson. 

{{< file "terminal" "command line" >}}
{{< highlight text >}}
npm i -g firebase-tools
firebase init functions
{{< /highlight >}}

### Install SendGrid

Email sending tasks can be handled with the [SendGrid Mail](https://github.com/sendgrid/sendgrid-nodejs/tree/master/packages/mail) package. 

{{< highlight text >}}
cd functions
npm install @sendgrid/mail
{{< /highlight >}}


### Create an Email Template

SendGrid provides a GUI for emailing templating that supports dynamic data interpolation and versioning. I highly recommending using [transactional templates](https://github.com/sendgrid/sendgrid-nodejs/blob/master/use-cases/transactional-templates.md) to organize your email. Make note of the *template ID*. 

{{< figure src="img/sendgrid-template.png" caption="SendGrid transactional template with dynamic values" >}}

### Add the SendGrid API Key to Firebase

Create a new API Key on SendGrid by going to *Settings -> Account Details -> API Keys*. It just needs to provide full access to the Mail Send API. 

{{< figure src="img/sendgrid-restricted-apikey.png" caption="SendGrid API Key Settings" >}}


Now set the API key and template ID in the Firebase project with the following command. 

{{< file "terminal" "command line" >}}
{{< highlight text >}}
firebase functions:config:set sendgrid.key=YOUR_KEY sendgrid.template=TEMPLATE_ID
{{< /highlight >}}



## Email Cloud Functions

The following Cloud Functions samples demonstrate how to send transactional email is response to common events, like user sign-up, HTTP, Firestore database writes, and a scheduled time. 

Start by setting up your functions code with Firebase Admin and the SendGrid Mail Node SDK. 

{{< file "typescript" "functions/src/index.ts" >}}
{{< highlight typescript >}}
// Firebase Config
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();

// Sendgrid Config
import * as sgMail from '@sendgrid/mail';

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);
{{< /highlight >}}


You may also want to disable `strictNullChecks` mode for this lesson. 

{{< file "cog" "tsconfig.json" >}}
{{< highlight json >}}
{
  "compilerOptions": {
    // ...omitted
    "strict": true,
    "strictNullChecks": false, // <-- add this line
    "target": "es2017"
  },
}

{{< /highlight >}}

### Auth - User Triggered Events

The auth function will run when a new user is created. This will happen the first time they log in with OAuth or when a new user is created with email/password auth. 

{{< file "typescript" "functions/src/index.ts" >}}
{{< highlight typescript >}}
// Sends email to user after signup
export const welcomeEmail = functions.auth.user().onCreate(user => {

    const msg = {
        to: user.email,
        from: 'hello@fireship.io',
        templateId: TEMPLATE_ID,
        dynamic_template_data: {
            subject: 'Welcome to my awesome app!',
            name: user.displayName,
        },
    };

    return sgMail.send(msg);

});
{{< /highlight >}}

### HTTP - Call Functions Directly

In many cases, you may want to call functions from your frontend app with a data payload. [Callable Functions](https://firebase.google.com/docs/functions/callable) make this task very simple because you can easily validate that the user is logged in with an email address before passing off a request to SendGrid. 

You must return a JS object from a callable function that can be converted to JSON, so do NOT simply return the SendGrid promise because it resolves to non-serializable data. 

{{< file "typescript" "functions/src/index.ts" >}}
{{< highlight typescript >}}
// Sends email via HTTP. Can be called from frontend code. 
export const genericEmail = functions.https.onCall(async (data, context) => {

    if (!context.auth && !context.auth.token.email) {
        throw new functions.https.HttpsError('failed-precondition', 'Must be logged with an email address');
    }

    const msg = {
        to: context.auth.token.email,
        from: 'hello@fireship.io',
        templateId: TEMPLATE_ID,
        dynamic_template_data: {
            subject: data.subject,
            name: data.text,
        },
    };

    await sgMail.send(msg);

    // Handle errors here

    // Response must be JSON serializable
    return { success: true };

});
{{< /highlight >}}



### Firestore - Database Triggered Events

Firestore provides an excellent mechanism for triggering events for transactional email. The data model below represents posts and comments. The function code will find the `authorEmail` when a comment is created under the post. 

{{< figure src="img/sendgrid-firestore.png" caption="Firestore data model for posts/comments. Email will send when a new comment is created." >}}

{{< file "typescript" "functions/src/index.ts" >}}
{{< highlight typescript >}}

// Emails the author when a new comment is added to a post
export const newComment = functions.firestore.document('posts/{postId}/comments/{commentId}').onCreate( async (change, context) => {

    // Read the post document
    const postSnap = await db.collection('posts').doc(context.params.postId).get();

    // Raw Data
    const post = postSnap.data();
    const comment = change.data();

    // Email
    const msg = {
        to: post.authorEmail,
        from: 'hello@fireship.io',
        templateId: TEMPLATE_ID,
        dynamic_template_data: {
            subject: `New Comment on ${post.title}`,
            name: post.displayName,
            text: `${comment.user} said... ${comment.text}`
        },
    };

    // Send it
    return sgMail.send(msg);

});
{{< /highlight >}}

### Cron - Scheduled Events

The final function we'll look at sends a batch of emails on a specific time schedule. If you want to dynamically schedule multiple emails, checkout the [Firebase Task Queue](/lessons/cloud-functions-scheduled-time-trigger/) lesson. 

{{< file "typescript" "functions/src/index.ts" >}}
{{< highlight typescript >}}
// Send a summary email to all users 
export const weeklySummary =  functions.pubsub.schedule('every friday 05:00').onRun(async context => {
    const userSnapshots = await admin.firestore().collection('users').get();

    const emails = userSnapshots.docs.map(snap => snap.data().email);

    const msg = {
        to: emails,
        from: 'hello@fireship.io',
        templateId: TEMPLATE_ID,
        dynamic_template_data: {
            subject: `Your Weekly Summary`,
            text: 'Insert summary here...'
        },
    };

    return sgMail.send(msg);

});
{{< /highlight >}}


### Deploy and Test

Deploy your functions. You can test them from the Firebase console, or follow one of the frontend framework integrations below. 

{{< file "terminal" "command line" >}}
{{< highlight text >}}
firebase deploy --only functions
{{< /highlight >}}

{{< figure src="img/result-email.png" caption="Result in Gmail" >}}


## Next Steps

You now have all the backend infrastructure in place for transactional email. The next step is to learn how to use these functions from your frontend app.  

<nav>
    {{< mvp-chapter name="angular" link="/snippets/sendgrid-angular" >}}
    {{< mvp-chapter name="react" link="/snippets/sendgrid-react" >}}
    {{< mvp-chapter name="vue" link="/snippets/sendgrid-vue" >}}
    {{< mvp-chapter name="svelte" link="/snippets/sendgrid-svelte" >}}
    {{< mvp-chapter name="flutter" link="/snippets/sendgrid-flutter" >}}
</nav>
