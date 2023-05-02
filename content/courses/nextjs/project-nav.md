---
title: Navigation
description: Create a navigation menu
weight: 11
lastmod: 2023-04-26T11:11:30-09:00
draft: false
vimeo: 822821316
emoji: 🌠
video_length: 2:53
---

{{< file "react" "App.tsx" >}}
```tsx
import Link from 'next/link';
import styles from './NavMenu.module.css';
import Image from 'next/image';

export default function NavMenu() {
  return (
    <nav className={styles.nav}>
      <Link href={'/'}>
        <Image
          src="/logo.svg" // Route of the image file
          width={216}
          height={30}
          alt="NextSpace Logo"
        />
      </Link>
      <ul className={styles.links}>
        <li>
          <Link href={'/about'}>About</Link>
        </li>
        <li>
          <Link href={'/blog'}>Blog</Link>
        </li>
        <li>
          <Link href={'/users'}>Users</Link>
        </li>
      </ul>
    </nav>
  );
}

```