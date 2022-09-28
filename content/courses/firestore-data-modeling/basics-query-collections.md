---
title: Query 
lastmod: 2019-04-16T09:12:30-08:00
draft: false
description: How to query collections of documents. 
weight: 7
emoji: 🔥
vimeo: 330791975
video_length: 3:22
---

Examples of how to make queries in Firestore that resemble SQL. 

{{< file "js" "firestore.js" >}}
```js
// Basic Where
const rangeQuery = db.collection('users').where('age', '>=', 21);

// AND
const andQuery = db.collection('users')
                .where('age', '==', 21)
                .where('sex', '==', 'M')


// OR
const q1 = db.collection('users').where('age', '==', 21);
const q2 = db.collection('users').where('age', '==', 25);


// NOT
const not1 = db.collection('users').where('age', '>', 21);
const not2 = db.collection('users').where('age', '<', 21);
```
