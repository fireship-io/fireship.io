---
title: Firebase Quickstart
lastmod: 2020-07-26T08:27:33-07:00
publishdate: 2020-07-26T08:27:33-07:00
author: Jeff Delaney
draft: false
description: Start here! Learn the fundamentals of Firebase with vanilla JS to prepare you for other frameworks.
tags: 
    - firebase
    - javascript
    - quickstart

youtube: q5J5ho7YUhA
github: https://github.com/fireship-io/3.1-firebase-basics
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

[Firebase](/tags/firebase) makes app development faster ⚡, cheaper 💵, and more enjoyable 😀 for developers. The idea behind a **Backend-as-a-Service** (BaaS) is to eliminate the need to write and maintain server-side code - things like user authentication, trusted API calls, security logic, database connections, traffic scaling, and the list goes on. These requirements take time, money, and add complexity to a project. The more resources you can invest in the frontend user experience, the more likely your app is to succeed. Firebase makes this possible by providing you with a variety of frontend SDKs that connect your web/mobile apps to various Google Cloud Resources. 

The following lesson is a step-by-step breakdown of the basics of Firebase intended for both beginners and experienced users. My goal is to give you a foundation of knowledge that every Firebase developer should know...

- Use the Firebase CLI Tools to manage and deploy an app. (hosting) 
- Setup basic user auth with Google Sign-In. (authentication)
- Create Firestore database records and listen to changes in realtime. (firestore)

## Getting Started 

### Create a Firebase Project

A Firebase project is a container for [Google Cloud](https://cloud.google.com/) infrastructure. A project can have multiple apps - it is common for web, iOS, and Android apps to share the same project. Create a new [project](https://console.firebase.google.com/) from the dashboard. 

{{< figure src="img/project-create.png" caption="Create a Firebase project" >}}


### Add Firebase to a Web App

In order to use Firebase in a frontend web or mobile app, you must add an app to your project - this step generates credentials that will connect your app to the cloud.  Navigate to ⚙️ *settings* and click the *Add app* button. 

{{< figure src="img/firebase-web-app.png" caption="Create a web app from the project settings panel" >}}

This will generate a config snippet that can be added to any Firebase project. Let's create an extremely simple web app that consists of an *public/index.html* file and *public/app.js* file. 

{{< figure src="img/project-files.png" >}}

In the `<head>` of the HTML file, paste the snippet. Also, include script tags for the Auth and Firestore SDKs because they will be needed in the upcoming section. Including these script tags extends the core SDK with the features we plan on using (firestore and auth). 

💡 In VS Code you can type the `!` followed by tab to quickly generate HTML boilerplate. 

{{< file "html" "index.html" >}}
```html
<head>
  <script src="https://www.gstatic.com/firebasejs/7.16.1/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/7.16.1/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/7.16.1/firebase-firestore.js"></script>

  <script>
    var firebaseConfig = {
      // TODO: Add your our config here
    };
    firebase.initializeApp(firebaseConfig);
  </script>

  <script src="app.js" defer></script>
</head>

<body>

    <h1>My Awesome App 🔥</h1>

</body>
```

In your JavaScript code, you can now reference `firebase`as a global variable. Log it out to make sure everything works. 

{{< file "js" "app.js" >}}
```javascript
console.log(firebase)
```

### Firebase CLI Tools

Now we're ready to connect our local code to the cloud via the Firebase Tools CLIs. Run the following commands to connect your terminal to the cloud. 

{{< file "terminal" "command line" >}}
```bash
npm install -g firebase-tools

firebase login

firebase init

firebase serve
```

When initializing the project, select *hosting* and *emulators*. Select YES for single page application, then choose the defaults for all other options. After running the serve command, you should see your site on `http://localhost:5000` in the browser. 

💡 Optional. It's also a good idea to install the [Firebase Explorer VS Code](https://marketplace.visualstudio.com/items?itemName=jsayol.firebase-explorer) extension. 

🔥 Also checkout the [Advanced Firebase Emulator Guide](/lessons/firebase-emulator-advanced/)

### Deploy to Hosting

It's very satisfying to launch your stuff to the Internet - Firebase makes deployment dead simple. 

{{< file "terminal" "command line" >}}
```bash
firebase deploy
```

{{< figure src="img/hosting-deploy.png" caption="And we're live" >}}

Your app is now available on the web at the domains listed in the *hosting* console. 

## User Authentication

When starting with a new project, most of my focus goes into the user authentication flow. Many critical features need a signed-in user, so it's a logical place to start. Firebase Auth provides a variety of ways to get users signed-in, but let's stick with the easiest option - Google Sign-in. 

🔥 Also checkout the [auth tag](/tags/auth/) for more advanced sign-in flows. 

### Enable Google Auth

From the Firebase Console, go to **Authentication >> Sign-in Method**. Enable Google. 

{{< figure src="img/auth-google.png" caption="Enable Google Sign-in" >}}

### Add SignIn and SignOut Buttons

First, we need some HTML to provide the UI for signed-in and signed-out users. The signed-in section will be hidden by default. 

{{< file "html" "index.html" >}}
```html
  <section id="whenSignedOut">

    <button id="signInBtn">Sign in with Google</button>

  </section>

  <section id="whenSignedIn" hidden="true">

    <div id="userDetails"></div>

    <button id="signOutBtn">Sign Out</button>

  </section>

```

Next, we can grab the buttons from the HTML and register and event handler function using `onclick`. When clicked the button will use the `signInWithPopup` method from the auth SDK to open a window prompting the user to enter their Google credentials. Firebase creates JSON Web Token (JWT) that identifies the user on this browser and keeps them authenticated until the token is invalidated or destroyed by clicking sign-out. 

{{< file "js" "app.js" >}}
```javascript
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

/// Sign in event handlers

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();
```

### Listen to changes to the Auth State

The `onAuthStateChanged` method runs a callback function each time the user's auth state changes. If signed-in, the `user` param will be an object containing the user's UID, email address, etc. If signed-out it will be null. 


{{< file "js" "app.js" >}}
```javascript
const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');
const userDetails = document.getElementById('userDetails');

auth.onAuthStateChanged(user => {
    if (user) {
        // signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});
```

{{< figure src="img/demo-auth.png" caption="The current state of your demo should look similar to this" >}}

## Firestore

Once you have a user authenticated, you probably want that user do something interesting, which typically means saving records to a database. [Firestore](https://cloud.google.com/firestore) is a NoSQL [document-oriented](https://en.wikipedia.org/wiki/Document-oriented_database) database similar to MongoDB. It's easy to manage and flexible, but modeling data relationships can be somewhat challenging. From the Firebase console, enable Firestore. 

{{< figure src="img/firestore-enable.png" caption="Enable Firestore in test mode. We will secure the database at the end of this tutorial." >}}

### Data Model

In this example we have a `things` collection. Our goal is to create a relationship between the currently signed-in user and Firestore where a user can *have many* things, while each thing *belongs to* one user. One way to model relationship is to save the user's `uid` value on each document like so:

{{< figure src="img/firestore-things.png" >}}

🔥 Checkout the [Firestore data modeling](/courses/firestore-data-modeling/) course for more common data modeling examples.  


### Writing to the Database

Now it's time to give our user a way to create database records. Let's start by adding some HTML where we can render out the items in the database. 

{{< file "html" "index.html" >}}
```html
  <section>

    <h2>My Firestore Things</h2>

    <ul id="thingsList"></ul>

    <button id="createThing">Create a Thing</button>

  </section>
```

Because the user must be signed-in, our code only runs when we have access to a user. The `thingsRef` points to a collection the database and provides methods to read and write to this location. Create a new document in the collection with `add`, where the argument is the actual data you want saved on the document.  

{{< file "js" "app.js" >}}
```javascript
const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');

const db = firebase.firestore();
let thingsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {

    if (user) {

        // Database Reference
        thingsRef = db.collection('things')

        createThing.onclick = () => {

            const { serverTimestamp } = firebase.firestore.FieldValue;

            thingsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                createdAt: serverTimestamp()
            });
        }

    }
});
```

💡 Notice how I used `serverTimestamp()` and NOT a client-side source like `Date.now()` for the timestamp. This ensures you will have a consistent timestamp across all devices. 

### Listening to a Realtime Query

Now that we can write to the database, let's make a query to read data and listen to changes in realtime. Similar to user auth, a query has an `onSnapshot` method that fires a callback function whenever the underlying data changes. 

{{< file "js" "app.js" >}}
```javascript
let thingsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {

    if (user) {

        // Database Reference
        thingsRef = db.collection('things')

        // ..... omitted .....

        // Query
        unsubscribe = thingsRef.where('uid', '==', user.uid)
            .onSnapshot(querySnapshot => {
                
                // Map results to an array of li elements

                const items = querySnapshot.docs.map(doc => {

                    return `<li>${doc.data().name}</li>`

                });

                thingsList.innerHTML = items.join('');

            });



    } else {
        // Unsubscribe when the user signs out
        unsubscribe && unsubscribe();
    }
});

```


💡 Notice how we are defining the query's return value as a variable named `unsubscribe` - this is a function we can call at some later point to turn-off the realtime subscription.

### Composite Indexes 

Certain queries can only be performed if an index is in place. The browser console with throw an error with a link you can follow you to create the necessary index. 

When combining a where method using `==` with a range operator like `<` or `orderBy` you will need an index, for example: 

{{< file "js" "app.js" >}}
```javascript
thingsRef
    .where('uid', '==', user.uid)
    .orderBy('createdAt') // Requires an index
```


{{< figure src="img/composite-index.png" caption="When you see this error, follow the link to create a composite index" >}}

### Security Rules

At some point, your database will need full server-side [security rules](/snippets/firestore-rules-recipes/) in place. Without rules, your app is vulnerable to exploitation because any hacker could grab your project config start writing to Firestore. 

The rules below ensure that (1) the entire database is locked down and (2) authenticated users can ONLY modify their own data. You can configure these rules from the *Database >> Rules*

{{< file "firebase" "firestore.rules" >}}
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Lock down the database
    match /{document=**} {
      allow read, write: if false; 
    
    // Allow authorized requests to the things collection
    match /things/{docId} {
      allow write: if request.auth.uid == request.resource.data.uid;
      allow read: if request.auth.uid == resource.data.uid;
    }
    
  }
}
```

## The End

That's it! But we've only scratched the surface here. Fireship.io is entirely dedicated to building apps on Firebase, so take a look around and find something fun to build like [this](/lessons/build-a-chatbot-with-dialogflow/). 
