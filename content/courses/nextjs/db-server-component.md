---
title: Server Component Fetching
description: Fetch data from React Server Components
weight: 34
lastmod: 2023-04-26T11:11:30-09:00
draft: false
vimeo: 822821093
emoji: 💽
video_length: 1:20
---

{{< file "react" "users/page.tsx" >}}
```tsx
import UserCard from '@/components/UserCard/UserCard';
import styles from './page.module.css';
import { prisma } from '@/lib/prisma';

export default async function Users() {
  const users = await prisma.user.findMany();

  return (
    <div className={styles.grid}>
      {users.map((user) => {
        return <UserCard key={user.id} {...user} />;
      })}
    </div>
  );
}
```

{{< file "react" "UserCard.tsx" >}}
```tsx
import Link from 'next/link';
import styles from './UserCard.module.css';

interface Props {
  id: string;
  name: string | null;
  age: number | null;
  image: string | null;
}

export default function UserCard({ id, name, age, image }: Props) {
  return (
    <div className={styles.card}>
      <img
        src={image ?? '/mememan.webp'}
        alt={`${name}'s profile`}
        className={styles.cardImage}
      />
      <div className={styles.cardContent}>
        <h3>
          <Link href={`/users/${id}`}>{name}</Link>
        </h3>
        <p>Age: {age}</p>
      </div>
    </div>
  );
}
```