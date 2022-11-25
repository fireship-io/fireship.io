---
title: Supabase CLI
description: Create and configure a new Supabase project with the CLI
weight: 11
lastmod: 2022-11-20T10:23:30-09:00
draft: false
vimeo: 773632087
emoji: 🔨
video_length: 3:57
quiz: true
free: true
---

<quiz-modal options="Data Detail List:Data Definition Language:Definitely Danger Ligma:Domain Definition Language" answer="Data Definition Language" prize="4">
  <h6>What does DDL stand for?</h6>
</quiz-modal>

## Resources

- Supabase Architecture: https://supabase.com/docs/architecture
- Supabase CLI Docs: https://supabase.com/docs/reference/cli
- Create your Prod Supabase instance by creating an account on supabase: https://app.supabase.com

## Commands

To install supbase cli:

```bash
yarn add supabase
```

To initialize a local supabase project:

```bash
npx supabase init
```

To start your local supabase instance:

```bash
npx supabase start
```

To create a new migration file:

```bash
npx supabase migration new <migration name>
```
