---
title: Squash
description: How to use git rebase to squash your commits
weight: 45
lastmod: 2021-09-05T10:23:30-09:00
draft: false
vimeo: 599255409
emoji: 🥞
video_length: 1:47
---

Start an interactive rebase from a feature, then choose the squash commend to flatten your commits into a single message. 

{{< file "terminal" "command line" >}}
```bash
git rebase master --interactive
```