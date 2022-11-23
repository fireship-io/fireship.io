---
title: Normalized Data Modeling
description: Learn how to model data in a relational database
weight: 42
lastmod: 2022-11-20T10:23:30-09:00
draft: false
vimeo: 773630081
emoji: 📊
video_length: 3:40
quiz: true
---

Link to final state of the original-ddl.sql: https://github.com/fireship-io/supaship.io/blob/course-end-point/supabase/migrations/20221116184131_original-ddl.sql

Interfaces for our rpc return types:

```ts
export interface GetPostsResponse {
  created_at: string;
  id: string;
  score: number;
  title: string;
  user_id: string;
  username: string;
}

export interface GetSinglePostWithCommentResponse {
  author_name: string;
  content: string;
  created_at: string;
  id: string;
  path: string;
  score: number;
  title: string;
}
```