---
title: One-to-Many 
lastmod: 2019-04-16T09:12:30-08:00
draft: false
description: Model and query a one-to-many relationship
weight: 12
emoji: 👪
vimeo: 330797611
video_length: 2:20
---

{{< file "js" "firestore.js" >}}
```js
const authorId = 'dr-seuss';

// 4. Embedded One-to-Many
const authorWithBooks = db.collection('authors').doc(authorId)


// 5. Subcollection
const books = db.collection('authors').doc(authorId).collection('books');


// 6. Root Collection, requires index
const booksFrom1971 = db.collection('books')
    .where('author', '==', authorId)
    .where('published', '>', 1971);
```