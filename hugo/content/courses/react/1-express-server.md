---
title: Express Server
description: Build a simple HTTP server with Node.js
weight: 21
lastmod: 2022-02-22T11:11:30-09:00
draft: false
vimeo: 685881163
emoji: 🦧
video_length: 4:08
---

## Additional Learning

- [CORS in 100 Seconds](https://youtu.be/4KHiSt0oLJ0)
- [REST in 100 Seconds](https://youtu.be/-MTSQjw5DrM)

## Complete Server Code

{{< file "js" "index.js" >}}
```javascript
import express from 'express';
import cors from 'cors';
// Initialize the express app
const app = express();
app.use(cors());
app.use(express.json());

// Make some animals
import Chance from 'chance';
const chance = new Chance();

const animals = [...Array(250).keys()].map(id => {
    return {
        id,
        type: chance.animal(),
        age: chance.age(),
        name: chance.name(),
    }
});

// Endpoint to search for animals
app.get('', (req, res) => {

    // Filter results by query
    const q = req.query.q?.toLowerCase() || '';
    const results = animals.filter(animal => animal.type.toLowerCase().includes(q));

    res.send(results);

});

app.listen(8080, () => console.log('Listening on port http://localhost:8080'));
```

