---
title: Verify Cookies
description: Authenticate users on the server with Firebase
weight: 51
lastmod: 2023-06-26T10:23:30-09:00
draft: false
vimeo: 840282806
emoji: 🔒
video_length: 1:42
---

## Authenticated Data Fetching

{{< file "ts" "[username]/bio/+page.server.ts" >}}
```typescript
import type { PageServerLoad } from "./$types";
import { adminAuth, adminDB } from "$lib/server/admin";
import { error } from "@sveltejs/kit";

export const load = (async ({ cookies }) => {

  const sessionCookie = cookies.get('__session');

  try {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie!);
      const userDoc = await adminDB.collection('users').doc(decodedClaims.uid).get();
      const userData = userDoc.data();

      return {
          bio: userData?.bio,
      }

  } catch (e) {
      console.log(e)
      // redirect(301, '/login');
      throw error(401, 'Unauthorized request!')
  }
}) satisfies PageServerLoad;
```