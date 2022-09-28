---
title: Access Control List
lastmod: 2019-04-16T09:12:30-08:00
draft: false
description: Use an ACL for fine-grained user authorization
weight: 18
emoji: 🎁
vimeo: 331445138
video_length: 2:26
---

Sample Firestore security rules for an Access Control List (ACL), where the content determines which users have authorization. 

{{< file "firebase" "rules.json" >}}
```js
match /posts/{document} {

    allow read;
    allow write: if resource.data.members.hasAny(request.auth.uid);

}
```

{{< figure src="/courses/firestore-data-modeling/img/ACL.png" caption="example of an Access Control List in Firestore"  >}}