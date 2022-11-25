---
title: Upvotes
description: Implement Reddit-style upvotes on posts
weight: 45
lastmod: 2022-11-20T10:23:30-09:00
draft: false
vimeo: 773630877
emoji: 👍
video_length: 1:50
---

cast-vote.ts:

```ts
import { supaClient } from "./supa-client";

export async function castVote({
  postId,
  userId,
  voteType,
  onSuccess = () => {},
}: {
  postId: string;
  userId: string;
  voteType: "up" | "down";
  onSuccess?: () => void;
}) {
  await supaClient.from("post_votes").upsert(
    {
      post_id: postId,
      user_id: userId,
      vote_type: voteType,
    },
    { onConflict: "post_id,user_id" }
  );
  onSuccess();
}
```

use-post-score.ts

```ts
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supaClient } from "./supa-client";

export function usePostScore(postId: string, initialScore: number | undefined) {
  const [score, setScore] = useState<number | undefined>(initialScore);
  const [sub, setSub] = useState<RealtimeChannel | undefined>(undefined);
  useEffect(() => {
    if (score === undefined && initialScore !== undefined) {
      setScore(initialScore);
    }
    if (!sub && postId) {
      setSub(
        supaClient
          .channel(`post_${postId}_score`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "post_score",
              filter: `post_id=eq.${postId}`,
            },
            (payload) => {
              setScore((payload.new as { score: number }).score as any);
            }
          )
          .subscribe()
      );
    }
    return () => {
      sub?.unsubscribe();
    };
  }, [postId]);

  return score;
}
```