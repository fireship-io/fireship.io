import * as functions from 'firebase-functions';
import { WebClient } from '@slack/web-api';
import * as crypto from 'crypto';
import * as tsscmp from 'tsscmp';
const { PubSub } = require('@google-cloud/pubsub');

 
export const questionBot = new WebClient(functions.config().slack.oauth);
export const proBot = new WebClient(functions.config().slack.pro_token);

export const pubsubClient = new PubSub();

export function publishMessage(topic, body) {
    const data = JSON.stringify(body);
    const dataBuffer = Buffer.from(data);
    return pubsubClient
      .topic(topic)
      .publisher()
      .publish(dataBuffer);
  }


export function legitSlackRequest(req) {
  // Your signing secret
  const slackSigningSecret = functions.config().slack.signing_secret;

  // Grab the signature and timestamp from the headers
  const requestSignature = req.headers['x-slack-signature'] as string;
  const requestTimestamp = req.headers['x-slack-request-timestamp'];

  // Covert to HMAC
  const hmac = crypto.createHmac('sha256', slackSigningSecret);

  // Update it with the Slack Request
  const [version, hash] = requestSignature.split('=');
  const base = `${version}:${requestTimestamp}:${JSON.stringify(req.body)}`;
  hmac.update(base);

  // Returns true if it matches
  return tsscmp(hash, hmac.digest('hex'));
}

