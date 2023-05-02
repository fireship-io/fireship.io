---
title: Error UI
description: Handle data fetching errors
weight: 37
lastmod: 2023-04-26T11:11:30-09:00
draft: false
vimeo: 822976943
emoji: 💽
video_length: 1:10
---

{{< file "react" "error.tsx" >}}
```jsx
'use client'; // Error components must be Client components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

```