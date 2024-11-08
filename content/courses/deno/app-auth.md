---
title: User Auth
description: Roll your own user authentication flow
weight: 47
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027526785
emoji: 🫂
video_length: 5:35
---



## Setup Environment Variables

{{< file "cog" ".env" >}}
```bash
GITHUB_CLIENT_ID=abc 
GITHUB_CLIENT_SECRET=xyz
REDIRECT_URI=http://localhost:8000/oauth/callback
```

Update the dev task to include the `--env` flag to load the env vars:

{{< file "deno" "deno.json" >}}
```json
{
  "tasks": {
    "dev": "deno serve --watch --unstable-kv --env -A src/main.ts",
  },
}
```

## Authentication with User Profile


Add database logic to store and get the user profile from the Deno KV database.

{{< file "ts" "db.ts" >}}
```typescript
export type GitHubUser = {
    login: string; // username
    avatar_url: string;
    html_url: string;
};


export async function storeUser(sessionId: string, userData: GitHubUser) {
    const key = ["sessions", sessionId];
    const res = await kv.set(key, userData);
    return res;
}

export async function getUser(sessionId: string) {
    const key = ["sessions", sessionId];
    const res = await kv.get<GitHubUser>(key);
    return res.value;
}
```

Create a new file to handle authentication logic

{{< file "ts" "auth.ts" >}}
```typescript
import { createGitHubOAuthConfig, createHelpers } from "jsr:@deno/kv-oauth";
import { pick } from "jsr:@std/collections/pick";
import { type GitHubUser, getUser, storeUser } from "./db.ts";

const oauthConfig = createGitHubOAuthConfig();
const {
  handleCallback,
  getSessionId,
} = createHelpers(oauthConfig);


export async function getCurrentUser(req: Request) {
    const sessionId = await getSessionId(req);
    console.log(sessionId)
    return sessionId ? await getUser(sessionId) : null;
}

export async function getGitHubProfile(accessToken: string) {
  const response = await fetch("https://api.github.com/user", {
    headers: { authorization: `Bearer ${accessToken}` },
  });
  
  if (!response.ok) {
    response.body?.cancel();
    throw new Error("Failed to fetch GitHub user");
  }
  
  return response.json() as Promise<GitHubUser>;
}

export async function handleGithubCallback(req: Request) {
  const { response, tokens, sessionId } = await handleCallback(req);
  const userData = await getGitHubProfile(tokens?.accessToken);
  const filteredData = pick(userData, ["avatar_url", "html_url", "login"]);
  await storeUser(sessionId, filteredData);
  return response;
}

```

Add the current user as a property on the router

{{< file "ts" "router.ts" >}}
```typescript
import type { GitHubUser } from "./db.ts";
import { getCurrentUser } from "./auth.ts";

export class Router {
    #routes: Route[] = [];

    currentUser?: GitHubUser | null; // <-- HERE

    #addRoute(method: string, path: string, handler: Handler) {
        const pattern = new URLPattern({ pathname: path });

        this.#routes.push({
            pattern,
            method,
            handler: async (req, info, params) => {
                try {
                    this.currentUser = await getCurrentUser(req); // <-- HERE
                    return await handler(req, info!, params!);
                } catch (error) {
                    console.error("Error handling request:", error);
                    return new Response("Internal Server Error", { status: 500 });
                }
            },
        });
    }

    get handler() {
        return route(this.#routes, () => new Response("Not Found", { status: 404 }))
    }

}
```

Configure the OAuth 2.0 routes

{{< file "ts" "main.ts" >}}
```typescript
import { createGitHubOAuthConfig, createHelpers } from "jsr:@deno/kv-oauth";
import { handleGithubCallback } from "./auth.ts";

const app = new Router();

const oauthConfig = createGitHubOAuthConfig({
  redirectUri: Deno.env.get('REDIRECT_URI')
});
const {
  signIn,
  signOut,
} = createHelpers(oauthConfig);


app.get("/oauth/signin", (req: Request) => signIn(req));
app.get("/oauth/signout", signOut);
app.get("/oauth/callback", handleGithubCallback);


app.get("/", () => {
  return new Response(
    render(HomePage({ user: app.currentUser })), 
    {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
});
```