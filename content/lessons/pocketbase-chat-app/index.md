---
title: Pocketbase Chat App
lastmod: 2022-12-17T12:19:06-07:00
publishdate: 2022-12-17T12:19:06-07:00
author: Jeff Delaney
draft: false
description: Build a chat app with Pocketbase and Svelte
tags: 
    - pocketbase
    - svelte

youtube: gUYBFDPZ5qk
github: https://github.com/fireship-io/pocketchat-tutorial
---


In the following tutorial we will build a chat app with [Pocketbase](https://pocketbase.io) and [Svelte](https://svelte.dev). Pocketbase is a backend (inspired by Firebase) structured as a single executable file. It provides a realtime DB based on SQLite and user authentication system that allows us to quickly prototype and deploy a chat app.

## Pocketbase Setup

### Serve it Locally

First, [download pocketbase](https://pocketbase.io/docs) then run the executable locally with `./pocketbase serve`. You should have access to an admin dashboard that looks like this:

{{< figure src="img/pocketbase-dashboard.png" caption="Pocketbase dashboard" >}}

### Data Model

Our chat app will have two collections: `users` and `messages`.

The `messages` collection will store the messages sent by users. Most importantly, it should have a relation field that points to the users collection. 

{{< figure src="img/pocketbase-relation.png" caption="Message belongs to User" >}}

## Frontend App

### Create a Svelte App

Create a new svelte app with Vite and select the TypeScript option. Install Pocketbase JS and serve the app.
    
{{< file "terminal" "command line" >}}
```bash
npm init vite pocketchat

cd pocketchat
npm install
npm install pocketbase

npm run dev
```

### Get the Current User

Put the current user from Pocketbase into a Svelte store.

{{< file "ts" "lib/pocketbase.ts" >}}
```jsx
import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

const pb = new PocketBase('http://127.0.0.1:8090'); 

export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange((auth) => {
    console.log('authStore changed', auth);
    currentUser.set(pb.authStore.model);
});
```

### Sign into the App

Let's use the username/password authentication strategy. 

Create a login form that uses the `authWithPassword` method. If the user doesn't exist, create a new user with the `create` method. 

{{< file "svelte" "Login.svelte" >}}
```svelte
<script lang="ts">
  import { currentUser, pb } from './pocketbase';

  let username: string;
  let password: string;

  async function login() {
    const user = await pb.collection('users').authWithPassword(username, password);
    console.log(user)
  }

  async function signUp() {
    try {
      const data = {
        username,
        password,
        passwordConfirm: password,
        name: 'hi mom!',
      };
      const createdUser = await pb.collection('users').create(data);
      await login();
    } catch (err) {
      console.error(err)
    }
  }

  function signOut() {
    pb.authStore.clear();
  }

</script>

{#if $currentUser}
  <p>
    Signed in as {$currentUser.username} 
    <button on:click={signOut}>Sign Out</button>
  </p>
{:else}
  <form on:submit|preventDefault>
    <input
      placeholder="Username"
      type="text"
      bind:value={username}
    />

    <input 
      placeholder="Password" 
      type="password" 
      bind:value={password} 
    />
    <button on:click={signUp}>Sign Up</button>
    <button on:click={login}>Login</button>
  </form>
{/if}

```

### Realtime Chat Messages

1. When the component mounts, fetch the latest messages. 
2. Setup a realtime listener for new messages and react the actions like `create` and `delete`. Make sure to unsubscribe when the component is destroyed.
3. Create new messages by passing the current user's ID to the `user` field.

{{< file "svelte" "Messages.svelte" >}}
```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { currentUser, pb } from './pocketbase';

  let newMessage: string;
  let messages = [];
  let unsubscribe: () => void;

  onMount(async () => {
    // Get initial messages
    const resultList = await pb.collection('messages').getList(1, 50, {
      sort: 'created',
      expand: 'user',
    });
    messages = resultList.items;

    // Subscribe to realtime messages
    unsubscribe = await pb
      .collection('messages')
      .subscribe('*', async ({ action, record }) => {
        if (action === 'create') {
          // Fetch associated user
          const user = await pb.collection('users').getOne(record.user);
          record.expand = { user };
          messages = [...messages, record];
        }
        if (action === 'delete') {
          messages = messages.filter((m) => m.id !== record.id);
        }
      });
  });

  // Unsubscribe from realtime messages
  onDestroy(() => {
    unsubscribe?.();
  });

  async function sendMessage() {
    const data = {
      text: newMessage,
      user: $currentUser.id,
    };
    const createdMessage = await pb.collection('messages').create(data);
    newMessage = '';
  }
</script>

<div class="messages">
  {#each messages as message (message.id)}
    <div class="msg">
      <img
        class="avatar"
        src={`https://avatars.dicebear.com/api/identicon/${message.expand?.user?.username}.svg`}
        alt="avatar"
        width="40px"
      />
      <div>
        <small>
          Sent by @{message.expand?.user?.username}
        </small>
        <p class="msg-text">{message.text}</p>
      </div>
    </div>
  {/each}
</div>

<form on:submit|preventDefault={sendMessage}>
  <input placeholder="Message" type="text" bind:value={newMessage} />
  <button type="submit">Send</button>
</form>
```

## Deploying Pocketbase to Linode

### Create a Linode

Head over the Linode and create a new server. Because they sponsored this video, you can use a [$100 credit](https://www.linode.com/fireship) to get started. 

{{< figure src="img/linode-dashboard.png" caption="Linode dashboard" >}}

### Copy Pocketbase to Linode

Copy the pocketbase executable to your server using [scp](https://www.ssh.com/ssh/scp/) or any other tool of your prefrence. 

{{< file "terminal" "command line" >}}
```bash
scp pocketbase root@YOUR-IP:/root/pb
```

### Run Pocketbase with Systemd

You could simply run the pocketbase command in a terminal, but your backend will stop running if the server ever needs to reboot. 

A more reliable to run Pocketbase is with a service manager like [systemd](https://www.freedesktop.org/wiki/Software/systemd/). You can use the following service file to run Pocketbase automatically on boot

Note: Replace `YOUR-DOMAIN` with your domain name or IP address. Remove the `--https` flag if you don't have a domain name.

{{< file "terminal" "/lib/systemd/system/pocketbase.service" >}}
```bash
[Unit]
Description = pocketbase

[Service]
Type           = simple
User           = root
Group          = root
LimitNOFILE    = 4096
Restart        = always
RestartSec     = 5s
StandardOutput = append:/root/pb/errors.log
StandardError  = append:/root/pb/errors.log
ExecStart      = /root/pb/pocketbase serve --http="YOUR-DOMAIN:80" --https="YOUR-DOMAIN:443"

[Install]
WantedBy = multi-user.target
```

Create this file on your server, then enable and start the service:

{{< file "terminal" "command line" >}}
```bash
systemctl enable pocketbase.service
systemctl start pocketbase
```
