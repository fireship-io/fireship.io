---
title: Data Model
description: How to model data relationships between users, posts, and hearts
weight: 31
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 508681378
emoji: 💾
video_length: 2:04
---

## Database Structure

- `users/{uid}` Public user profile
- `usernames/{username}` Username uniqueness tracking
- `users/{uid}/posts/{slug}` User can have many posts
- `users/{uid}/posts/{slug}/hearts/{uid}` many-to-many relationship between users and posts via hearts

## Data Model for Posts

Example post document with all expected fields.

```text
// users/{uid}/posts/{slug}

{
    title: 'Hello World,
    slug: 'hello-world',
    uid: 'userID',
    username: 'jeffd23',
    published: false,
    content: '# hello world!',
    createdAt: TimeStamp,
    updatedAt: TimeStamp,
    heartCount: 0,
}
```