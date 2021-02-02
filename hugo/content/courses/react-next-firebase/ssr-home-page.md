---
title: Home Page Feed
description: Render a feed of the latest posts with a collectionGroup query
weight: 22
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 
emoji: 🔥
video_length: 11:47
---

## Firebase Lib

{{< file "js" "lib/firebase.js" >}}
```javascript
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
```

## Home Page Post Feed

{{< file "js" "pages/index.js" >}}
```javascript
import PostFeed from '../components/PostFeed';
import Loader from '../components/Loader';
import { firestore, fromMillis, postToJSON } from '../lib/firebase';

import { useState } from 'react';

// Max post to query per page
const LIMIT = 1;

export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

    const query = firestore
      .collectionGroup('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts = (await query.get()).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);


  };

  return (
      <main>
        <PostFeed posts={posts} />

        {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

        <Loader show={loading} />

        {postsEnd && 'You have reached the end!'}
      </main>
  );
}

```