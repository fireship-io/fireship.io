---
title: Navbar
description: Create a dynamic navigation bar with React 
weight: 16
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 508623279
emoji: 🍫
video_length: 3:24
quiz: true
---

<quiz-modal options="<a />:<Route />:<Go />:<Link />" answer="<Link />" prize="7">
  <h5>Which element or component is used to create links in Next.js</h5>
</quiz-modal>


## Navbar Component

{{< file "js" "components/Navbar.js" >}}
```javascript
import Link from 'next/link';

// Top navbar
export default function Navbar() {
  const user = null;
  const username = null;

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">FEED</button>
          </Link>
        </li>

        {/* user is signed-in and has username */}
        {username && (
          <>
            <li className="push-left">
              <Link href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL} />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!username && (
          <li>
            <Link href="/enter">
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

```

## Usage in the App Component


{{< file "js" "pages/_app.js" >}}
```javascript
import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
```