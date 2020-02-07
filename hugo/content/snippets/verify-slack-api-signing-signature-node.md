---
title: Slack API Signing Signature Verification
lastmod: 2019-12-03T20:32:19-07:00
publishdate: 2019-12-03T20:32:19-07:00
author: Jeff Delaney
draft: false
description: Verify signed requests from the Slack API with Node.js
tags: 
    - node
    - slack

type: lessons
# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

Any Slack App that interacts with a server via a slash command, events API, or other outbound webhook should verify that the request actually came from the Slack API. The official docs provide a [guide](https://api.slack.com/docs/verifying-requests-from-slack#a_recipe_for_security), but the process is far from intuitive (hopefully it improves in the future). Currently, developers are required to manually hash the request and verify that matches the signature. The following snippet demonstrates how to handle this process in Node. 

## Slack Signing Secret Verification in Node

### Dependencies

First, install [tsscmp](https://www.npmjs.com/package/tsscmp)... unless you have a better way to perform *timing safe string comparison using double hashed message authentication code (HMAC)*. 

{{< file "terminal" "command line" >}}
{{< highlight text >}}
npm i tsscmp
{{< /highlight >}}

### Verify the Signature

The code example is based on a Firebase Cloud Function using TypeScript. If you use body-parser with ExpressJS, you need to stringify the body. You can obtain the *signing secret* from the Slack App admin basic info page. The code below compares this secret to the request body and signature to guarantee that it was sent from Slack and not some random hacker. 

{{< file "typescript" "server.ts" >}}
{{< highlight typescript >}}
import * as crypto from 'crypto';
import * as tsscmp from 'tsscmp';

function legitSlackRequest(req) {
  // Your signing secret
  const slackSigningSecret = 'your-signing-secret';

  // Grab the signature and timestamp from the headers
  const requestSignature = req.headers['x-slack-signature'] as string;
  const requestTimestamp = req.headers['x-slack-request-timestamp'];

  // Create the HMAC
  const hmac = crypto.createHmac('sha256', slackSigningSecret);

  // Update it with the Slack Request
  const [version, hash] = requestSignature.split('=');
  const base = `${version}:${requestTimestamp}:${JSON.stringify(req.body)}`;
  hmac.update(base);

  // Returns true if it matches
  return tsscmp(hash, hmac.digest('hex'));
}
{{< /highlight >}}

### Use it with Express

You can use this function in an Express endpoint or as middleware. 

{{< highlight typescript >}}
app.post('/my-slash-command', (req, res) => {

    const legit = legitSlackRequest(req);

    if (!legit) { 
        res.status(403).send('Nice try buddy. Slack signature mismatch.');
    }

});
{{< /highlight >}}