---
title: Realtime Data Hydration
description: Transition or hydrate server-rendered content to a realtime stream of data from Firestore
weight: 35
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 508686829
emoji: 🌊
video_length: 2:30
quiz: true
---

<quiz-modal options="initial page load:every route change:every React state change:every Firestore data change" answer="initial page load" prize="13">
  <h5>When does hydration need to happen?</h5>
</quiz-modal>

## Hydrate Server Props to Realtime Data

The post value will prefer the realtime value, but default to the server rendered content while it is loading. 

{{< file "js" "pages/username/slug.js" >}}
```javascript
import { useDocumentData } from 'react-firebase-hooks/firestore';

export default function Post(props) {
  const postRef = firestore.doc(props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  return (
    <main className={styles.container}>

      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

      </aside>
    </main>
  );
}

```