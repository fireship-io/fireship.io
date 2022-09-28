---
title: SSR User Profile Page
description: Implement server-side rendering to fetch data on the server
weight: 32
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 508681163
emoji: 😎
video_length: 5:43
quiz: true
---

<quiz-modal options="first():query[0]:limit(1):findOne()" answer="limit(1)" prize="11">
  <h5>How do you return a single result from a Firestore collection query</h5>
</quiz-modal>

## Helpers

The following helpers will be reused on in other components to simplify the code.

{{< file "js" "lib/firebase.js" >}}
```javascript
/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
  const usersRef = firestore.collection('users');
  const query = usersRef.where('username', '==', username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}
```

## User Profile Page

Render the Firebase user profile on the server. 

{{< file "js" "pages/username/index.js" >}}
```javascript
import { getUserWithUsername, postToJSON } from '../../lib/firebase';
import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  // JSON serializable data
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = userDoc.ref
      .collection('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5);
    posts = (await postsQuery.get()).docs.map(postToJSON);
  }

  return {
    props: { user, posts }, // will be passed to the page component as props
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}

```


## User Profile

[UserProfile Code](https://github.com/fireship-io/next-firebase-course/tree/main/components/UserProfile.js)

{{< file "js" "components/UserProfile.js" >}}
```javascript
 // see full source code
```

## Post Feed

[PostFeed Code](https://github.com/fireship-io/next-firebase-course/blob/main/components/PostFeed.js)


{{< file "js" "components/PostFeed.js" >}}
```javascript
 // see full source code
```