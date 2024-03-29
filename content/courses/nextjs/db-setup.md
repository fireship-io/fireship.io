---
title: Database Setup
description: Setup a free cloud PostgreSQL database 
weight: 30
lastmod: 2023-04-26T11:11:30-09:00
draft: false
vimeo: 822821136
emoji: 💽
video_length: 2:40
chapter_start: Data Fetching
---

Create a free PostgresSQL database at [Neon](https://neon.tech) or directly from the Vercel dashboard. Then update your environment variables.


{{< file "cog" ".env" >}}
```bash
DATABASE_URL=postgres://...
```