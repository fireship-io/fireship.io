---
title: Text-to-Image Server
description: Use Node.js, Express, and OpenAI to create a text-to-image API
weight: 42
lastmod: 2022-11-11T10:23:30-09:00
draft: false
vimeo: 773544292
emoji: 🤖
video_length: 4:36
quiz: true
---

<quiz-modal options="separation of concerns:to share with friends:to avoid leaking credentials" answer="to avoid leaking credentials" prize="13">
  <h6>Why do we store the API key as an env variable?</h6>
</quiz-modal>

## Server Setup

First, make sure to sign up for an [OpenAI](https://openai.com/api/) account and create an API key. Then store the API key in a file named `.env`. If it's included in your `.gitignore`, this file will be ignored by Git so that you don't accidentally share your API key with the world.

```bash
touch server.js

npm i dotenv express cors openai
node server.js
```

## Text-to-Image Code

```js
import * as dotenv from 'dotenv';
dotenv.config();

// Current OpenAI API release will look for API key in your .env file.
// make sure the KEY variable is named OPENAI_API_KEY="your-key-here"
import OpenAI from 'openai';

const openai = new OpenAI();

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/dream', async (req, res) => {
    const prompt = req.body.prompt;

    const aiResponse = await openai.images.generate({
        prompt,
        n: 1,
        size: '1024x1024',
    });

    const image = aiResponse.data[0].url;
    res.send({ image});
});

app.listen(8080, () => console.log('make art on http://localhost:8080/dream'));
```
