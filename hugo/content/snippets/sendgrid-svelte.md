---
title: SendGrid Svelte
lastmod: 2019-07-05T10:43:06-07:00
publishdate: 2019-07-05T10:43:06-07:00
author: Jeff Delaney
draft: false
description: Send transactional email with SendGrid from SvelteJS
type: lessons
# pro: true
tags: 
    - svelte
    - sendgrid

vimeo: 346869484
github: https://github.com/fireship-io/196-sendgrid-email-cloud-functions
# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3

# chapters:

---

{{< box emoji="👀" >}}
This tutorial is an extension of the [SendGrid Transactional Email Guide](/lessons/sendgrid-transactional-email-guide/). You must have the Cloud Functions deployed to start sending email from your frontend app. 
{{< /box >}}


## Initial Setup

Start by installing the [Firebase Web SDK](https://firebase.google.com/docs/web/setup), then initialize the packages in the root of the project.  

{{< file "js" "firebase.js" >}}
{{< highlight javascript >}}
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions';

const config = {
 // your firebase config
}

firebase.initializeApp(config);

export const app = firebase.app();
export const auth = firebase.auth();
export const functions = firebase.functions();
{{< /highlight >}}


## Transactional Email Component

The [Svelte](https://svelte.dev/) component uses the `onMount` lifecycle hook to monintor to the user's auth state, while `sendEmail` references the callable function deployed to Firebase.

{{< file "svelte" "App.svelte" >}}
{{< highlight html >}}
<script>
	import firebase from 'firebase/app';
	import { auth, functions } from './firebase';
	import { onMount } from 'svelte';

	let user = null;

	onMount(async () => {
		auth.onAuthStateChanged(u => user = u);
	});

	function sendEmail() {
		const callable = functions.httpsCallable('genericEmail');
		return callable({ text: 'Sending email with Svelte and SendGrid is fun!', subject: 'Email from Svelte'}).then(console.log);
	}
	
</script>
<h2>SendGrid Transactional Email with Svelte</h2>

{#if user}
	<p>{ JSON.stringify(user) }</p>
    <button on:click={() => sendEmail()}>Send Email with Callable Function</button>
    <button on:click={() => auth.signOut()}>SignOut</button>

{:else}
	<button on:click={() => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())}>SignIn with Google</button>
{/if}

{{< /highlight >}}
