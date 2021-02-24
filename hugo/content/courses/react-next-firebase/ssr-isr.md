---
title: ISR Incremental Static Regeneration
description: Use incremental static regeneration (ISR) to rebuild pages on the fly
weight: 34
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 508686915
emoji: 🦾
video_length: 3:45
---


## Main Post Content Page

This page is statically generated, BUT regenerated after new requests come in at an interval of 5000ms. If a prerendered page does not exist, will fallback to regular SSR. 

{{< file "js" "pages/username/slug.js" >}}
```javascript
import styles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';


export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref.collection('posts').doc(slug);
    post = postToJSON(await postRef.get());

    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  // Improve my using Admin SDK to select empty docs
  const snapshot = await firestore.collectionGroup('posts').get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: 'blocking',
  };
}

export default function Post(props) {

  return (
    <main className={styles.container}>

    </main>
  );
}
```

## Post Content with Markdown

{{< file "terminal" "command line" >}}
```bash
npm i react-markdown
```

Learn more about [React Markdown](https://github.com/remarkjs/react-markdown)

{{< file "js" "components/PostContent.js" >}}
```javascript
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

// UI component for main post content
export default function PostContent({ post }) {
  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

  return (
    <div className="card">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written by{' '}
        <Link href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </Link>{' '}
        on {createdAt.toISOString()}
      </span>
      <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  );
}
```