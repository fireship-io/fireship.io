---
title: One-to-One 
lastmod: 2019-04-16T09:12:30-08:00
draft: false
description: Model and query a one-to-one relationship
weight: 11
emoji: 👪
vimeo: 330797883
video_length: 2:01
---

{{< file "js" "firestore.js" >}}
{{< highlight javascript >}}
const userId = 'ayn-rand';

// 1. Embedded, all data contained on single document, One-to-few

const authorWithAccount = db.collection('authors').doc(userId)

// 2. Shared Document ID
const author = db.collection('authors').doc(userId)
const account = db.collection('account').doc(userId);


// 3. Join related documents with different IDs, 
const getAccount = async (userId) => {
    const snapshot = await db.collection('authors').doc(userId).get();
    const user = snapshot.data();

    return db.collection('accounts').doc(user.accountId)
}
{{< /highlight >}}