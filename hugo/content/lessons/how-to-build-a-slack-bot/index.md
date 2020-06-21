---
title: How to Build a Slack App
lastmod: 2019-12-03T14:22:00-07:00
publishdate: 2019-12-03T14:22:00-07:00
author: Jeff Delaney
draft: false
description: A comprehensive guide to serverless Slack Apps with Firebase Cloud Functions & Firestore
tags: 
    - slack
    - cloud-functions
    - node

youtube: 25ArxpK48tU
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

[Slack Apps](https://api.slack.com/start/overview), or Bots, allow you to extend slack with interactive features that can improve your teams productivity. The following lesson is a step-by-step guide to building a Slack App using Firebase [Cloud Functions](/tag/cloud-functions) as the backend server. 

{{< box icon="slack" class="" >}}
This lesson builds Slack App for the actual [Fireship Slack](https://fireship.page.link/slack). Join to see the CyberJeff bot in action. 
{{< /box >}}

Our Slack App will perform the following tasks. 

- Listen to events, such as a new user joining the #general channel. 
- Retrieve the user's slack profile. 
- Send a private personalized message. 
- Add a slash command for user-directed actions. 

## Create a Slack App

At this point, it is assumed you have admin access to a Slack workspace. If not, feel free to [create one](https://slack.com/help/articles/206845317-create-a-slack-workspace) to follow this tutorial. 

Once you have a workspace, create a [new Slack App](https://api.slack.com/apps). 

{{< figure src="img/slack-app-create.png" caption="Create a Slack App" >}}


## Verify Cloud Function Ownership

Before Slack can send events to our Cloud Function, it needs to verify that we own the server. Slack performs a handshake by sending an HTTP request with a `challenge` parameter to the Cloud Function, then the function must respond back with the same value.  

### Initialize Cloud Functions

Initialize Cloud Functions. This demo uses the TypeScript flavor. 

{{< file "terminal" "command line" >}}
{{< highlight text >}}
firebase init functions
{{< /highlight >}}


### Build The Challenge Function

The function only needs to respond with the challenge one time.

{{< file "typescript" "index.ts" >}}
{{< highlight typescript >}}
export const myBot = functions.https.onRequest( (req, res) => {
  
  // Request from Slack
  const { challenge }  = req.body;

  // Response from You
  res.send({ challenge })

});
{{< /highlight >}}

Deploy it

{{< file "terminal" "command line" >}}
{{< highlight text >}}
firebase deploy --only functions:myBot
{{< /highlight >}}

{{< figure src="img/slack-bot-url.png" caption="Copy the Function URL from the terminal output" >}}

### Enter The Deployed URL

Subscribe to an event that you want to listen to, then paste in the Function URL from the last step. Slack should automatically verify the URL and give it a green checkmark ✅. 

{{< figure src="img/slack-app-event.png" caption="Subscribe to the member_joined_channel event. Notice how our URL is now verified." >}}

## Build the Bot

Now it's time to do some real work. 

### Install Dependencies

The [Slack Node SDK](https://github.com/slackapi/node-slack-sdk) is a monorepo that contains several packages. The Web API can read and modify data in the workspace. Google PubSub will be used to handle long running background tasks in te following steps. 

{{< file "terminal" "command line" >}}
{{< highlight text >}}
npm install @slack/web-api
npm install @google-cloud/pubsub
{{< /highlight >}}



### OAuth Token

The OAuth token is used to authenticate your bot/server into a *workspace* so it can interact with your channel (like post messages).

{{< figure src="img/slack-app-install.png" caption="Install the app into your workspace." >}}

Once installed, it will take you directly to the **OAuth token**. It usually starts with `xoxb` or `xoxp`.

{{< figure src="img/slack-oauth-token.png" caption="Copy the OAuth Token" >}}

Copy the OAuth Token and save it as a Firebase Functions [environment](https://firebase.google.com/docs/functions/config-env) variable. 

{{< file "terminal" "command line" >}}
{{< highlight text >}}
firebase functions:config:set slack.token=YOUR-TOKEN
{{< /highlight >}}


### Signing Secrets

When receiving events from Slack, you should validate the **signing secret**, which can be found in Basic Info panel. This ensures that only requests from Slack can interact with your function by decoding the [digital signature](https://en.wikipedia.org/wiki/Digital_signature) of the request. 

{{< file "terminal" "command line" >}}
{{< highlight text >}}
firebase functions:config:set slack.signing_secret=YOUR-TOKEN
{{< /highlight >}}

{{< box icon="lightbulb" class="" >}}
Read this the [Slack Signing Secret Validation](/snippets/verify-slack-api-signing-signature-node) snippet for further details.
{{< /box >}}

### Add Scopes (Permissions) 

OAuth scopes define what your app is allowed to do. You can fine tune permissions under the *OAuth & Permissions* page. Follow the principle of least privilege and only allow your bot access to resources that it actually needs to do its job. In our case, we need to read a user profile and add them to a specific slack channel. 

## Listen to Events

Our first goal is to listen to events that happen in the Slack workspace. Slack should notify our server anytime a user joins a channel with the `member_joined_channel` event. 

{{< figure src="img/slack-events.png" >}}

⚡ Your server must respond be quickly, within 3000ms or less, otherwise Slack will timeout and attempt to retry. 

So then, how do we build an app that performs a long-running backend process? There are many right answers, but in Firebase, the best option is to enqueue a [PubSub Cloud Function](https://cloud.google.com/functions/docs/calling/pubsub). It allows the initial HTTP endpoint to simply hand off the message and respond quickly to Slack. 


Import the dependencies and initlizize them with the environment credentials. 

{{< file "typescript" "index.ts" >}}
{{< highlight typescript >}}
import * as functions from 'firebase-functions';

import { WebClient } from '@slack/web-api';
const bot = new WebClient(functions.config().slack.token);

const { PubSub } = require('@google-cloud/pubsub');
const pubsubClient = new PubSub();
{{< /highlight >}}


### HTTP Gateway

The HTTP gateway validates the request, enqueues a PubSub message with the request, then responds with a 200 code to keep Slack happy. 

Extra Snippet: [verifySlackSignature](/snippets/verify-slack-api-signing-signature-node)


{{< highlight typescript >}}

export const myBot = functions.https.onRequest( async (req, res) => {
    
    // Validate Signature
    verifySlackSignature(req); // See snippet above for implementation

    const data = JSON.stringify(req.body);
    const dataBuffer = Buffer.from(data);

    await pubsubClient
            .topic('slack-channel-join')
            .publisher()
            .publish(dataBuffer);


    res.sendStatus(200);

});
{{< /highlight >}}

### PubSub Function

All the heavy-lifting happens in the PubSub function because we have no time-constraints here. The `message.json` contains the same data you would have handled in `req.body` in the HTTP function. 

{{< file "typescript" "index.ts" >}}
{{< highlight typescript >}}
  export const slackChannelJoin = functions.pubsub.topic('slack-channel-join')
    .onPublish(async (message, context) => {


    const { event } = message.json; 

    const { user, channel } = event;

    // TODO something cool...


});
{{< /highlight >}}

### Respond To the User as the Bot

In this section, our app makes requests to the Slack API that (1) fetch the user's Slack profile (2) invite them to a channel, and (3) greet them with a direct message.

Note: The Slack API does not provide typings for the response object, so you'll have to treat it as `any` in typescript. 

{{< highlight typescript >}}
export const slackChannelJoin = functions.pubsub
  .topic('slack-channel-join')
  .onPublish(async (message, context) => {

    const { event } = message.json; 

    const { user, channel } = event;

    // IDs for the channels you plan on working with
    const generalChannel = 'C12345';
    const newChannel = '#froopy-land';

    // Throw error if not on the general channel
    if (channel !== generalChannel) {
        throw Error()
    }


  // Get the full Slack profile

    const userResult = await bot.users.profile.get({ user });
    const { email, display_name } = userResult.profile as any;


    // Invite the slack user to a new channel
    const invite = await bot.channels.invite({
        channel: newChannel,
        user
    });


    // Send a Message
    const chatMessage = await bot.chat.postMessage({
        channel: newChannel,
        text: `Hey ${display_name}! So glad to have you on my Slack!`
    });


});
{{< /highlight >}}

## Additional Ideas to Try

### Listen to Slash Commands

Events are great, but somethings you want to give users tools to manually kick off interactivity - that's where [slash commands](https://api.slack.com/interactivity/slash-commands) come in. They work very similar to events, but are are triggered by the user entering `/some-command` into the workspace. 

{{< figure src="img/slack-app-slash.png" caption="Slash commands follow the same basic flow as events" >}}

### /slap someone

{{< figure src="https://cdn.sanity.io/images/hfh83o0w/production/9e279c7b45b755f818f551fbfd451f3456154dd8-1920x1080.png?w=800&fit=crop&fm=webp" caption="Deploying Firebase Cloud Function to use with Slack slash commands. Sending someone a /slap!" >}}

Learn more about slack commands in the [full lesson by AJonP](https://ajonp.com/lessons/slap-someone-with-slack-commands/). 


### Add a Conversational Bot

[DialogFlow](/lessons/build-a-chatbot-with-dialogflow/) can integrate into a Slack App with just a few button clicks. Turning your app into a full-blown chatbot allows users to have human-like conversations with the app, which is often more natural than slash commands. 
