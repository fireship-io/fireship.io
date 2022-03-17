---
title: PWA
description: Dynamic PWA App Badge and Deployment
weight: 33
lastmod: 2022-02-22T11:11:30-09:00
draft: false
vimeo: 689135035
emoji: 📱
video_length: 3:36
---

## App Badge Hook

{{< file "react" "useAppBadge.jsx" >}}
```jsx
import { useState } from 'react';

const useAppBadge = () => {
  const [counter, setCounter] = useState(1);

  const setBadge = () => {
    setCounter(counter + 1);
    if (navigator.setAppBadge) {
      navigator.setAppBadge(counter);
    } else if (navigator.setClientBadge) {
      navigator.setClientBadge();
    }
  };

  const clearBadge = () => {
    setCounter(1);
    if (navigator.clearAppBadge) {
      navigator.clearAppBadge();
    } else if (navigator.clearClientBadge) {
      navigator.clearClientBadge();
    }
  };

  return [setBadge, clearBadge];
};

export default useAppBadge;
```