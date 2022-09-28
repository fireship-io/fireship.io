---
title: Toast
description: Use react-hot-toast to trigger animated toast messages
weight: 17
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 508623199
emoji: 🧈
video_length: 1:30
---

## Install Hot Toast

{{< file "terminal" "command line" >}}
```bash
npm i react-hot-toast
```

Check out the [official docs](https://react-hot-toast.com/).

## Declare the Toaster

{{< file "js" "pages/_app.js" >}}
```javascript
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}
```

## Trigger a Toast Message

{{< file "js" "pages/index.js" >}}
```javascript
import toast from 'react-hot-toast';

export default function Home() {
  return (
    <div>
      <button onClick={() => toast.success('hello toast!')}>
        Toast Me
      </button>
    </div>
  );
}
```