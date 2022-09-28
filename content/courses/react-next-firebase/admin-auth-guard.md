---
title: Admin Pages
description: Create an AuthCheck component to render content for signed-in users
weight: 40
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 508695103
emoji: 🛑
video_length: 1:50
chapter_start: CRUD Features
quiz: true
---

<quiz-modal options="true:false" answer="false" prize="16">
  <h5>Client-side security logic will keep your app 100% secure?</h5>
</quiz-modal>

## Auth Check or Route Guard

{{< file "js" "components/AuthCheck.js" >}}
```javascript
import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

// Component's children only shown to logged-in users
export default function AuthCheck(props) {
  const { username } = useContext(UserContext);

  return username ? props.children : props.fallback || <Link href="/enter">You must be signed in</Link>;
}
```

## Usage in a Component

{{< file "js" "admin/index.js" >}}
```javascript
import AuthCheck from '../../components/AuthCheck';


export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>

      </AuthCheck>
    </main>
  );
}
```