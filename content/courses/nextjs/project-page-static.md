---
title: Static pages
description: Create a statically rendered page
weight: 12
lastmod: 2023-04-26T11:11:30-09:00
draft: false
vimeo: 822821511
emoji: 🌠
video_length: 1:15
---

{{< file "react" "page.tsx" >}}
```tsx
import { Metadata } from 'next';

export const dynamic = 'force-static'; // no necessary, just for demonstration

export const metadata: Metadata = {
  title: 'About Us',
  description: 'About NextSpace',
};

export default function Blog() {
  return (
    <div>
      <h1>About us</h1>
      <p>We are a social media company that wants to bring people together!</p>
    </div>
  );
}

```