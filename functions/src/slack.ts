import * as functions from 'firebase-functions';
import { db } from './config';
import { omitBy, isUndefined, get } from 'lodash';

// TS import broken?
const { PubSub } = require('@google-cloud/pubsub');
const ps = new PubSub();

const PS_TOPIC = 'slack-question';

import { WebClient } from '@slack/client';
const bot = new WebClient(functions.config().slack.oauth);

//// NOTE - Slack API is very weird with threads.
//// ts or ts_thread === messageId
//// ts !== ts_thread, you have reply message
//// events have message data or a message object on edits
//// deleted_ts is used for deleted messages
//// On reply edits, the ts_thread exists on the previous_message
//// FML

const BOT_RESPONSE =
  'Got it, expect an answer soon. Feel free to add additional details to this thread.';

// Gatekeeper for writing messages to Firestore, must respond in 3000ms
export const questionBotHandler = functions.https.onRequest(
  async (req, res) => {
    const body = req.body;

    // Slash Command
    if (body.command === '/ask') {
      await pub(body);
      res
        .status(200)
        .json({ text: BOT_RESPONSE, attachments: { text: BOT_RESPONSE } });
      return;
    }

    // Bot Question
    const { type, subtype } = body.event;
    const { thread_ts, text } = body.event.message || body.event;

    // Attempt to filter invalid questions
    const okType = type === 'message';
    const okUrl =
      thread_ts ||
      (text && text.includes('fireship.io')) ||
      subtype === 'message_deleted';

    // If OK, publish data
    if (okType && okUrl) {
      await pub(body);
      res.sendStatus(200);
    }
  }
);

// @Question Bot https://fireship.io/foo hello
// Creates and updates slack threads to that mention the bot
export const recordMessage = functions.pubsub
  .topic(PS_TOPIC)
  .onPublish(async (message, context) => {
    console.log(message.json);
    const { event, command } = message.json;

    if (event) {
      console.log(event);
      return await handleBotEvent(event);
    }

    if (command) {
      return handleSlackCommand(message.json);
    }
  });

/// HELPERS ///

async function handleSlackCommand(body) {
  const { channel, user_id, text } = body;
  const { display_name, real_name, is_bot, image_32 } = await getProfile(
    user_id
  );
  // TODO no ts on slack cmd messages :(
}

async function handleBotEvent(event) {
  const { subtype, channel } = event;

  const msgSource = event.message || event;

  const { ts, thread_ts, user, text, hidden } = msgSource;

  const { display_name, real_name, image_32 } = await getProfile(user);


  // Computed properties
  const slackURL = toSlackURL(channel, ts);
  const deleted = subtype === 'message_deleted' || hidden;
  const visible = true;
  const is_bot = BOT_RESPONSE === text;

  const msg = omitBy(
    {
      text,
      display_name,
      real_name,
      image_32,
      slackURL,
      is_bot,
      deleted,
      ts,
      thread_ts,
      visible
    },
    isUndefined
  );

  const isReply = thread_ts && ts !== thread_ts;

  if (is_bot) {
    return null;
  } else if (isReply) {
    const thread = get(event, 'message.deleted_ts') || thread_ts;

    // We are dealing with a thread, atttach to parent
    const ref = db.collection('slack').doc(thread);
    const parent = await ref.get();

    console.log(parent.exists, 'thread');

    if (parent.exists) {
      const data = { replies: { [ts]: msg } };
      await ref.set(data, { merge: true });
    }
  } else if (event.deleted_ts) {
    // Handle deleted msgs
    const prev = event.previous_message;
    if (prev.thread_ts && prev.thread_ts !== prev.ts) {
      // Delete reply
      const ref = db.collection('slack').doc(prev.thread_ts);
      const parent = await ref.get();
      if (parent.exists) {
        const data = { replies: { [prev.ts]: { visible: false } } };
        await ref.set(data, { merge: true });
      }
    } else {
      const ref = db.collection('slack').doc(event.deleted_ts);
      await ref.set({ visible: false }, { merge: true });
    }
  } else {
    console.log('new/update question');
    const ref = db.collection('slack').doc(ts);
    const permalink = extractPermalink(text);
    const data = { ...msg, permalink };
    await ref.set(data, { merge: true });

    if (!subtype) {
      await botResponse(channel, ts);
    }
  }
}

async function getProfile(user) {
  // Get user profile
  const profileRes: any = await bot.users.profile.get({ user });
  return profileRes.profile;
}

async function pub(body) {
  const data = JSON.stringify(body);
  const dataBuffer = Buffer.from(data);
  await ps
    .topic(PS_TOPIC)
    .publisher()
    .publish(dataBuffer);
}

async function botResponse(channel, thread_ts) {
  const text = BOT_RESPONSE;
  bot.chat.postMessage({ channel, text, thread_ts });
}

function extractPermalink(text) {
  const url = text
    .split('<')
    .join('')
    .split('>')[1]
    .trim();
  return url.endsWith('/') ? url : url + '/';
}

function toSlackURL(channel, ts: string) {
  // https://angularfirebase.slack.com/archives/C7R8UUC0N/p1546533240007900
  const msgId = ts
    .toString()
    .split('.')
    .join('');
  return `https://angularfirebase.slack.com/archives/${channel}/p${msgId}`;
}
