---
title: Loader
description: Create a loading spinner to manage loading states across the app
weight: 15
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 508623443
emoji: 🔄
video_length: 1:30
---

## Build a Loading Spinner

{{< file "js" "components/Loader.js" >}}
```javascript
// Loading Spinner
export default function Loader({ show }) {
  return show ? <div className="loader"></div> : null;
}
```

{{< file "css" "globals.css" >}}
```css
.loader {
  border: 10px solid var(--color-bg); 
  border-top: 10px solid var(--color-blue); 
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```