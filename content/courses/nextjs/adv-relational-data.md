---
title: Follower System
description: Model data for user followers
weight: 42
lastmod: 2023-04-26T11:11:30-09:00
draft: false
vimeo: 822976589
emoji: 🧑‍🚀
video_length: 2:40
---

## Prisma Schema

Update the schema

{{< file "terminal" "schema.prisma" >}}
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  bio           String? @db.Text
  age           Int?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  followedBy    Follows[] @relation("following")
  following     Follows[] @relation("follower")
}

model Follows {
  follower    User @relation("follower", fields: [followerId], references: [id])
  followerId  String
  following   User @relation("following", fields: [followingId], references: [id])
  followingId String

  @@id([followerId, followingId])
}
```

Then migrate it 

{{< file "terminal" "command line" >}}
```bash
npx prisma migrate dev
```