---
title: Many-to-Many 
lastmod: 2019-04-16T09:12:30-08:00
draft: false
description: Model and query a many-to-many relationship
weight: 13
emoji: 👪
vimeo: 330797354
video_length: 4:09
---

{{< file "js" "firestore.js" >}}
{{< highlight javascript >}}
const authorId = 'dr-seuss';
const bookId   = 'lorax';

// 7. Middle Man Collection
const userReviews = db.collection('reviews').where('author', '==', authorId);
const bookReviews = db.collection('reviews').where('book', '==', bookId);

// Single read with composite key
const specificReview = db.collection('reviews').doc(`${bookId}_${authorId}`);


// 8. Map
// Reviews embadded on books
const bookWithReviews = db.collection('books').doc(bookId);
const userReviews = db.collection('books').orderBy('reviews.jeff-delaney');


// 9. Array
const books = db.collection('books').where('categories', 'array-contains', 'fiction');



// 10. Bucket
// Get a collection of documents with an array of IDs

const getLikedBooks = async() => {

    // Get books through user likes
    const userLikes = await db.collection('likes').orderBy('jeff-delaney').get();
    const bookIds = userLikes.docs.map(snap => snap.id);

    const bookReads = bookIds.map(id => db.collection('books').doc(id).get() );
    const books = Promise.all(bookReads)
}


getLikedBooks()
{{< /highlight >}}