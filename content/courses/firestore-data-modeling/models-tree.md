---
title: Hierarchy
lastmod: 2019-04-16T09:12:30-08:00
draft: false
description: Model a tree or hierarchy for threaded comments
weight: 19
emoji: 🎁
vimeo: 331445659
video_length: 3:07
---


{{< file "js" "firestore.js" >}}
```typescript
const topLevel = db.collection('comments').where('parent', '==', false);


const level = db.collection('comments').where('parent', '==', id)


const traverseAll = (id) => {
    const tree = db.collection('comments')
    .where('parent', '>=', id)
    .where('parent', '<=', `${id}~`)
}
```