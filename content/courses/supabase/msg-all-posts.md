---
title: Post List
description: Build the UI for the feed of all posts
weight: 43
lastmod: 2022-11-20T10:23:30-09:00
draft: false
vimeo: 773630489
emoji: 📲
video_length: 1:57
---

AllPosts.tsx:

```tsx
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "./App";
import { castVote } from "./cast-vote";
import { CreatePost } from "./CreatePost";
import { GetPostsResponse } from "./database.types";
import { supaClient } from "./supa-client";
import { timeAgo } from "./time-ago";
import { UpVote } from "./UpVote";
import { usePostScore } from "./use-post-score";

export function AllPosts() {
  const { session } = useContext(UserContext);
  const { pageNumber } = useParams();
  const [bumper, setBumper] = useState(0);
  const [posts, setPosts] = useState<GetPostsResponse[]>([]);
  const [myVotes, setMyVotes] = useState<
    Record<string, "up" | "down" | undefined>
  >({});
  useEffect(() => {
    const queryPageNumber = pageNumber ? +pageNumber : 1;
    supaClient
      .rpc("get_posts", { page_number: queryPageNumber })
      .select("*")
      .then(({ data }) => {
        setPosts(data as GetPostsResponse[]);
        if (session?.user) {
          supaClient
            .from("post_votes")
            .select("*")
            .eq("user_id", session.user.id)
            .then(({ data: votesData }) => {
              if (!votesData) {
                return;
              }
              const votes = votesData.reduce((acc, vote) => {
                acc[vote.post_id] = vote.vote_type as any;
                return acc;
              }, {} as Record<string, "up" | "down" | undefined>);
              setMyVotes(votes);
            });
        }
      });
  }, [session, bumper, pageNumber]);

  return (
    <>
      {session && (
        <CreatePost
          newPostCreated={() => {
            setBumper(bumper + 1);
          }}
        />
      )}
      <div className="posts-container">
        {posts?.map((post, i) => (
          <Post
            key={post.id}
            postData={post}
            myVote={myVotes?.[post.id] || undefined}
            onVoteSuccess={() => {
              setBumper(bumper + 1);
            }}
          />
        ))}
      </div>
    </>
  );
}

function Post({
  postData,
  myVote,
  onVoteSuccess,
}: {
  postData: GetPostsResponse;
  myVote: "up" | "down" | undefined;
  onVoteSuccess: () => void;
}) {
  const score = usePostScore(postData.id, postData.score);
  const { session } = useContext(UserContext);
  return (
    <div className="post-container">
      <div className="post-upvote-container">
        <UpVote
          direction="up"
          filled={myVote === "up"}
          enabled={!!session}
          onClick={async () => {
            await castVote({
              postId: postData.id,
              userId: session?.user.id as string,
              voteType: "up",
              onSuccess: () => {
                onVoteSuccess();
              },
            });
          }}
        />
        <p className="text-center" data-e2e="upvote-count">
          {score}
        </p>
        <UpVote
          direction="down"
          filled={myVote === "down"}
          enabled={!!session}
          onClick={async () => {
            await castVote({
              postId: postData.id,
              userId: session?.user.id as string,
              voteType: "down",
              onSuccess: () => {
                onVoteSuccess();
              },
            });
          }}
        />
      </div>
      <Link to={`/post/${postData.id}`} className="flex-auto">
        <p className="mt-4">
          Posted By {postData.username} {timeAgo((postData as any).created_at)}{" "}
          ago
        </p>
        <h3 className="text-2xl">{postData.title}</h3>
      </Link>
    </div>
  );
}
```

Form component to create a New post, CreatePost.tsx:

```tsx
import { Session } from "@supabase/supabase-js";
import { useContext, useRef, useState } from "react";
import { UserContext } from "./App";
import { supaClient } from "./supa-client";

export interface CreatePostProps {
  newPostCreated?: () => void;
}

function createNewPost({
  session,
  title,
  content,
}: {
  session: Session | null;
  title: string;
  content: string;
}) {
  return supaClient.rpc("create_new_post", {
    userId: session?.user.id || "",
    title,
    content,
  });
}

export function CreatePost({ newPostCreated = () => {} }: CreatePostProps) {
  const { session } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  return (
    <>
      <form
        className="create-post-form"
        data-e2e="create-post-form"
        onSubmit={(event) => {
          event.preventDefault();
          createNewPost({ session, title, content }).then(({ error }) => {
            if (error) {
              console.log(error);
            } else {
              setTitle("");
              setContent("");
              if (titleInputRef.current) {
                titleInputRef.current.value = "";
              }
              if (contentInputRef.current) {
                contentInputRef.current.value = "";
              }
              newPostCreated();
            }
          });
        }}
      >
        <h3>Create A New Post</h3>
        <input
          type="text"
          name="title"
          ref={titleInputRef}
          className="create-post-title-input"
          placeholder="Your Title Here"
          onChange={({ target: { value } }) => {
            setTitle(value);
          }}
        />
        <textarea
          name="contents"
          ref={contentInputRef}
          placeholder="Your content here"
          className="create-post-content-input"
          onChange={({ target: { value } }) => {
            setContent(value);
          }}
        />
        <div>
          <button type="submit" className="create-post-submit-button">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
```
