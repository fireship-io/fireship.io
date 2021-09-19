---
title: git revert
description: Undo a commit with out changing the course of history
weight: 41
lastmod: 2021-09-05T10:23:30-09:00
draft: false
vimeo: 599244917
emoji: 🔧
video_length: 2:00
---

Undo a commit with a new commit

{{< file "terminal" "command line" >}}
```bash
git revert <commit-ID> -m "reverting last commit"
```