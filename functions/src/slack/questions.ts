// import * as functions from 'firebase-functions';
import * as functions from 'firebase-functions';
import { db } from '../config';
import { omitBy, isUndefined, get } from 'lodash';
import * as getUrls from 'get-urls';

import { questionBot, publishMessage } from './helpers';

const PUBSUB_TOPIC = 'slack-question';
const BOT_ID = '<@UF68X24P9>';
const BOT_RESPONSE =
  'Got it 👍 Feel free to start a thread on your original question if you want to add more details';



//// NOTE - Slack API is very weird with threads.
//// ts or ts_thread === messageId
//// ts !== ts_thread, you have reply message
//// events have message data or a message object on edits
//// deleted_ts is used for deleted messages
//// On reply edits, the ts_thread exists on the previous_message
//// FML

export const slashAskHandler = functions.https.onRequest(async (req, res) => {
  const { channel_id, text } = req.body;

  const thread: any = await questionBot.chat.postMessage({
    as_user: true,
    channel: channel_id,
    text
  });

  const data = { ...req.body, ts: thread.ts };

  await publishMessage(PUBSUB_TOPIC, data);

  res.send({
    text: BOT_RESPONSE
  });
});

// Gatekeeper for writing messages to Firestore, must respond in 3000ms
export const questionBotHandler = functions.https.onRequest(
  async (req, res) => {
    const body = req.body;

    // Bot Question
    const { type, subtype } = body.event;
    const { thread_ts, text } = body.event.message || body.event;


    // Attempt to filter invalid questions
    const okType = type === 'message';
    const okUrl =
      thread_ts ||
      (text && text.includes(BOT_ID)) ||
      subtype === 'message_deleted';

    // If OK, publish data
    if (okType && okUrl) {
      await publishMessage(PUBSUB_TOPIC, body);
    }

    res.sendStatus(200);
  }
);

// @Question Bot https://fireship.io/foo hello
// Creates and updates slack threads to that mention the bot
export const recordMessage = functions.pubsub
  .topic(PUBSUB_TOPIC)
  .onPublish(async (message, context) => {
    // console.log(message.json);
    const { event, command } = message.json;

    if (command) {
      return await handleSlashCommand(message.json);
    }

    if (event) {
      return await handleBotEvent(event);
    }
  });

/// HELPERS ///

async function handleSlashCommand(data) {
  const { channel_id, user_id, ts, user_name } = data;
  let text = data.text;

  const { display_name, real_name, image_32 } = await getProfile(user_id);
  const slackURL = toSlackURL(channel_id, ts);
  const ref = db.collection('slack').doc(ts);
  const permalink = extractPermalink(text);
  text = await fillMentions(text);

  const msg = omitBy(
    {
      text,
      display_name,
      real_name,
      image_32,
      slackURL,
      user_name,
      ts,
      permalink,
      visible: true
    },
    isUndefined
  );

  return ref.set(msg, { merge: true });
}

async function handleBotEvent(event) {
  const { subtype, channel } = event;

  const msgSource = event.message || event;

  const { ts, thread_ts, user, hidden } = msgSource;
  let text = msgSource.text;

  const { display_name, real_name, image_32 } = await getProfile(user);

  // Computed properties
  const slackURL = toSlackURL(channel, ts);
  const deleted = subtype === 'message_deleted' || hidden;
  const visible = true;
  const is_bot = false; // TODO refactor
  text = await fillMentions(text);

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
    const ref = db.collection('slack').doc(ts);
    const permalink = extractPermalink(text);
    const data = { ...msg, permalink };
    await ref.set(data, { merge: true });

    if (!subtype) {
      await questionBot.chat.postEphemeral({
        text: BOT_RESPONSE,
        channel: channel,
        user: user
      });
    }
  }
}

async function getProfile(user) {
  // Get user profile
  const profileRes: any = await questionBot.users.profile.get({ user });
  return profileRes.profile;
}

async function fillMentions(text: string) {
  if (!text) return '';
  const re = /<@(.*?)>/g;
  const mentions = text.match(re) || [];

  let modified = text;

  for (const m of mentions) {
    const user_id = m.substr(2, 9);
    const { display_name, real_name } = await getProfile(user_id);
    modified = modified.replace(m, `@${display_name || real_name}`);
  }

  return modified;
}

function extractPermalink(text) {
  text = text.replace(/>/g, '').replace(/</g, '');
  const urls: Set<string> = getUrls(text);
  const url = Array.from(urls)[0] || '';

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
