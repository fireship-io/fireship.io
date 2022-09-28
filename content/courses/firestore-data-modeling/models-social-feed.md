---
title: Follower Feed 
lastmod: 2019-04-16T09:12:30-08:00
draft: false
description:  User-to-user follows and follower feeds 
weight: 20
emoji: 🎁
vimeo: 331445416
video_length: 4:21
---

The code below uses this data model to follow/unfollow users & query the most recent posts from users that are being followed. 

{{< file "js" "firestore.js" >}}
```js
import { db } from './config';
import firebase from 'firebase/app;
const remove = firebase.firestore.FieldValue.arrayRemove;
const union = firebase.firestore.FieldValue.arrayUnion;

export const follow  = (followed, follower) => {
    const followersRef = db.collection('followers').doc(followed);

   followersRef.update({ users: union(follower) });
}

// 2. Unfollow User

export const unfollow  = (followed, follower) => {
    const followersRef = db.collection('followers').doc(followed);

    followersRef.update({ users: remove(follower) });
}



// 3. Get posts of followers

export const getFeed = async() => {

    const followedUsers = await db.collection('followers')
        .where('users', 'array-contains', 'jeffd23')
        .orderBy('lastPost', 'desc')
        .limit(10)
        .get();


    const data = followedUsers.docs.map(doc => doc.data());

    const posts = data.reduce((acc, cur) => acc.concat(cur.recentPosts), []);
 

    const sortedPosts = posts.sort((a, b) => b.published - a.published)


    // render sortedPosts in DOM

}
```


{{< figure src="/courses/firestore-data-modeling/img/social-feed.png" >}}