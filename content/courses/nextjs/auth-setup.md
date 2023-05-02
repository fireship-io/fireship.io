---
title: Auth.js Setup
description: Add auth.js for user authentication
weight: 20
lastmod: 2023-04-26T11:11:30-09:00
draft: false
vimeo: 822820853
emoji: 🤠
video_length: 2:40
chapter_start: User Authentication
---

💎 Generate NEXTAUTH_SECRET [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

## Auth.js Setup

Add [Auth.js](https://authjs.dev/getting-started/oauth-tutorial) to your project. 

{{< file "terminal" "command line" >}}
```bash
npm install next-auth

# Generate a random token
# add this value as NEXTAUTH_SECRET in .env
openssl rand -base64 32
```

## Create a Catchall Route

Create the following route file `api/auth/[...nextauth]/route.ts`. 

{{< file "react" "route.tsx" >}}
```tsx
import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ]
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

