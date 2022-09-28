---
title: Express
description: Build your first API endpoint with Express
weight: 16
lastmod: 2020-04-20T10:23:30-09:00
draft: false
vimeo: 416483410
emoji: 
icon: node
video_length: 3:46
---

## Create an Express App

{{< file "ts" "api.ts" >}}
```javascript
import express, { Request, Response } from 'express';
export const app = express();

// Allows cross origin requests
import cors from 'cors';
app.use(cors({ origin: true }));


app.use(express.json());


app.post('/test', (req: Request, res: Response) => {
  const amount = req.body.amount;
  res.status(200).send({ with_tax: amount * 7 });
});
```

## Listen to Incoming Requests

{{< file "ts" "index.ts" >}}
```javascript
// Start the API with Express
import { app } from './api';
const port = process.env.PORT || 3333;
app.listen(port, () => console.log(`API available on http://localhost:${port}`));

```