---
title: Svelte Realtime Todo List with Firebase 
lastmod: 2019-04-24T07:01:58-07:00
publishdate: 2019-04-24T07:01:58-07:00
author: Jeff Delaney
draft: false
description: Build a realtime ToDo list with Svelte 3 and Firebase (RxFire)
tags: 
    - svelte
    - firebase
    - rxjs

youtube: 043h4ugAj4c
github: https://github.com/fireship-io/182-svelte-firebase
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---


[Svelte](https://svelte.dev/) 3 was [announced](https://twitter.com/Rich_Harris/status/1120342713843507201) recently and it delivers a refreshing alternative to the big three component frameworks/libraries of React, Angular, and Vue. In fact, calling it a framework/library would not be very accurate, because Svelte is actually a *compiler* that turns your code into Vanilla JS, meaning it does not need to ship the entire framework in the JS bundle. Its focus on simplicity really stands out and makes for a very developer-friendly JavaScript experience. 

I highly recommend watching the video from Svelte's creator, Rich Harris, to get a better of the low-level engineering decisions that make this tool special.  


{{< youtube AdNJ3fydeao >}}


## Realtime Todo List

Our goal is to build an authenticated realtime todo list with Svelte 3 and Firebase, similar to the demo below: 

{{< vimeo 332304365 >}}

### Initial Setup

Let's start with a blank Svelte project and install [RxFire](https://github.com/firebase/firebase-js-sdk/tree/master/packages/rxfire). 

{{< file "terminal" "command line" >}}
```text
npx degit sveltejs/template realtime-todos
cd realtime-todos

npm install
npm i rxfire firebase rxjs

npm run dev
```

Next, head over the the [Firebase Console](https://console.firebase.google.com/) and grab your web app credentials. Create a file to handle the initialization of Firebase. 

{{< file "js" "firebase.js" >}}
```js
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
var firebaseConfig = {
    // ...your firebase credentials
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export const db = firebase.firestore();
```

## User Authentication

Our first milestone is to create a component that allows the user to login and logout using their Google account. 

### Login

We can handle the login process by binding the Firebase popup logic to a button click event with Svelte `<button on:click={login}>`

The `authState` function is provided by RxFire and contains an Observable of the user's authentication state. When logged-in, it provides basic Google account data like displayName, email, photoURL, etc. When logged-out, it is null. 

Keep in mind, we will be creating the `Todos` and `Profile` components in the upcoming steps. 

{{< file "svelte" "App.svelte" >}}
```html
<script>
    import Profile from './Profile.svelte';
    import Todos from './Todos.svelte';

    import { auth, googleProvider } from './firebase';
    import { authState } from 'rxfire/auth';

    let user;

    const unsubscribe = authState(auth).subscribe(u => user = u);

    function login() {
        auth.signInWithPopup(googleProvider);
    }
</script>


<section>
{#if user}
    <Profile {...user} />
    <button on:click={ () => auth.signOut() }>Logout</button>
    <hr>
    <Todos uid={user.uid} />
{:else}
	<button on:click={login}>
		Signin with Google
	</button>
{/if}
</section>
```

### User Profile

When a user is logged-in, we can pass the props down to a child (dumb) component used for data presentation only. The `export` keyword makes it possible to pass a value from the parent the the child. 

{{< file "svelte" "Profile.svelte" >}}
```html
<script>
    export let displayName;
    export let photoURL;
    export let uid;
</script>


<h3>Hi { displayName }!</h3>

<img src={ photoURL } width="100" alt="user avatar">
<p>Your userID is { uid }</p>
```


## Firestore Todo List

The todo is just a document that tells us who created it, along with some text and a boolean status. We can toggle the status to mark a todo complete or incomplete. 

{{< figure src="img/todo-document-model.png" caption="Data model of todo item in Firestore" >}}

### Todo Item

The `TodoItem` is a dumb/presentational component that displays data and emits custom events back up to the parent. When the user clicks the remove 🗑️ button it will emit a [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) that tells the parent which document ID to remove from the database. Similarly, we can toggle the *complete* status by clicking the ✔️ or ❌ buttons. 


{{< file "svelte" "TodoItem.svelte" >}}
```html
<script>

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    
    function remove() {
		dispatch('remove', { id });
	}

	function toggleStatus() {
        let newStatus = !complete;
		dispatch('toggle', {
            id,
            newStatus
        });
    }
    

    export let id; // document ID
    export let text;
    export let complete;
</script>

<style>
    .is-complete {
        text-decoration: line-through;
        color: green;
    }
</style>


<li>

{#if complete}
    <span class="is-complete">{ text }</span>
    <button on:click={toggleStatus}> ✔️ </button>
{:else}
    <span>{ text }</span>
    <button on:click={toggleStatus}> ❌ </button>
{/if}

<button on:click={remove}> 🗑 </button>

</li>
```

### The Todo List

The `TodoList` is a smart component that queries that data and interacts with the database. The `$` used in front the *todos* in the each loop will automatically subscribe and unsubscribe to the Observable - similar to the async pipe in Angular.

{{< file "svelte" "Todos.svelte" >}}
```html
<script>
    import TodoItem from './TodoItem.svelte';
    import { db } from './firebase';
    import { collectionData } from 'rxfire/firestore';
    import { startWith } from 'rxjs/operators';

    // User ID passed from parent
    export let uid;

    // Form Text
    let text = 'some task';

    // Query requires an index, see screenshot below
    const query = db.collection('todos').where('uid', '==', uid).orderBy('created');

    const todos = collectionData(query, 'id').pipe(startWith([]));

    function add() {
        db.collection('todos').add({ uid, text, complete: false, created: Date.now() });
        text = '';
    }

    function updateStatus(event) {
        const { id, newStatus } = event.detail;
        db.collection('todos').doc(id).update({ complete: newStatus });
    }

    function removeItem(event) {
        const { id } = event.detail;
        db.collection('todos').doc(id).delete();
    }
</script>

<style>
    input { display: block }
</style>

<ul>
	{#each $todos as todo}

        <TodoItem {...todo} on:remove={removeItem} on:toggle={updateStatus} />
        
	{/each}
</ul>


<input bind:value={text}>

<button on:click={add}>Add Task</button>
```

You need a composite index to run the database query in the code above. 

{{< figure src="img/composite-index.png" caption="Check the browser error logs for a link to create this index"  >}}

## The End

That's it! I can confidently say that Svelte has been the easiest JS component library to learn and start putting to use in a productive way. This is partly due to my background with other JS frameworks, but also due the fact that Svelte focuses on simplicity, has amazing docs, and creates powerful abstractions that just fit well with native DOM apis. 
