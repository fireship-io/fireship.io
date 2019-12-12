import * as functions from 'firebase-functions';
import { db } from '../config';
import * as express from 'express';

import { legitSlackRequest, proBot, publishMessage } from './helpers';

const WELCOME = 'slack-welcome';
const SLASH_PRO = 'slack-slash-pro';

// Welcomes new PRO member when they sign up.
export const proBotWelcome = functions.pubsub
  .topic(WELCOME)
  .onPublish(async (message, context) => {
    const { user } = message.json.event;

    const { email, display_name } = (await proBot.users.profile.get({ user }))
      .profile as any;

    const result = await db
      .collection('users')
      .where('email', '==', email)
      .get();

    if (!result.empty) {
      const fireshipUser = result.docs[0];
      const ref = fireshipUser.ref;
      const data = fireshipUser.data();


      if (data.is_pro && !data.pro_slack) {
        const proChannel = 'G62D4QB9R';

        // const proBadge = await proBot.users.profile.set({ user, name: 'pro', value: data.pro_status });

        const invite = await proBot.groups.invite({
          channel: proChannel,
          user
        });
        const im = (await proBot.im.open({ user })).channel as any;

        const dm = await proBot.chat.postMessage({
          channel: im.id,
          text: `Hey ${display_name || 'there'}! Thank you for being a PRO member 🔥. \nFor starters, I invited you to the #pro-members channel for priority chat support, but feel free to send me a private message on this thread.\nYou now have access to special _slash_ commands, type */pro* anywhere in Slack get started.`
        });

        await ref.update({ pro_slack: user });
      }
    }
  });

export const proBotSlash = functions.pubsub
  .topic(SLASH_PRO)
  .onPublish(async (message, context) => {

    const { user_id, channel_id, command } = message.json;

    try {
      const { email } = (await proBot.users.profile.get({ user: user_id }))
        .profile as any;

      const { data } = await getFirebaseUser(email);

      console.log(1, channel_id)


      let text = `hmm, i have nothing useful to report`;

      switch (command) {
        case '/pro':
          if (!data) {
            text = `Unable to link ${email} to a Fireship account. Either change your slack email to match Fireship OR signup on https://fireship.io`;
          } else if (!data.is_pro) {
            text = `Account located, but your PRO status is not active. Verify your status here https://fireship.io/dashboard. If you think there's problem direct message Jeff Delaney`;
          } else {
            text = `🦄 PRO status confirmed!\n\n- Use */t-shirt* to register for a lifetime T-shirt\n- Use */sticker* to get a free sticker\n- Use */beer-me* for unlimited free beer.`;
            if (!data.pro_slack) {
              await publishMessage(WELCOME, { event: { user: user_id, channel: channel_id } });
            }
          }
          break;

        case '/beer-me':
          if (data && data.is_pro) {
            text = '🍺 Cheers! Thank you for being a PRO member!';
          } else {
            text = 'Sorry, only PRO members can drink beer in here.';
          }
          break;

        case '/t-shirt':
          if (data && data.is_pro && data.pro_status === 'lifetime') {
            text =
              '🦄 Lifetime status confirmed! Direct message Jeff Delaney with your size & mailing address';
          } else {
            text = 'You must be a lifetime member to register for a T-shirt.';
          }
          break;

        case '/sticker':
          if (data && data.is_pro) {
            text =
              '🔥 Eligible! Please fill out this form https://docs.google.com/forms/d/e/1FAIpQLSe18TfAoxvdrSiT8TcwWNxDW_kQULkZeRRmUtDgoSBWKdYR7A/viewform?usp=sf_link';
          } else {
            text = 'You must be a PRO member to register for a sticker.';
          }
          break;
      }

      const dm = await proBot.chat.postEphemeral({
        channel: channel_id,
        user: user_id,
        text
      });
    } catch (err) {
        console.error(err);
      const dm = await proBot.chat.postEphemeral({
        channel: channel_id,
        user: user_id,
        text: 'Something went wrong. Try again.'
      });
    }
  });
// Handlers

const app = express();

app.post('/', async (req, res) => {
  const legit = legitSlackRequest(req);
  if (!legit) {
    res.status(403).send('Slack signature mismatch');
  } else {
    await publishMessage(WELCOME, req.body);
  }

  res.sendStatus(200);
});

app.post('/pro', async (req, res) => {
  await publishMessage(SLASH_PRO, req.body);
  res.status(200).send({ text: 'Fetching latest...' });
});

app.post('/beer-me', async (req, res) => {
  await publishMessage(SLASH_PRO, req.body);
  res.status(200).send({ text: 'verifying beer eligibility...' });
});

app.post('/t-shirt', async (req, res) => {
  await publishMessage(SLASH_PRO, req.body);
  res.status(200).send({ text: 'verifying T-shirt eligibility...' });
});

app.post('/sticker', async (req, res) => {
  await publishMessage(SLASH_PRO, req.body);
  res.status(200).send({ text: 'verifying sticker eligibility...' });
});

export const proBotHandler = functions.https.onRequest(app);

async function getFirebaseUser(email) {
  const result = await db
    .collection('users')
    .where('email', '==', email)
    .get();

  if (!result.empty) {
    const fireshipUser = result.docs[0];
    const ref = fireshipUser.ref;
    const data = fireshipUser.data();
    return { ref, data };
  } else {
    return { };
  }
}
