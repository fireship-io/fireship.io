---
title: git rebase
description: Use git rebase to merge updates with a clean commit history
weight: 44
lastmod: 2021-09-05T10:23:30-09:00
draft: false
vimeo: 599244606
emoji: 📜
video_length: 2:16
---

## Rebase 

From a feature branch, rebase the latest changes from the master branch. 

{{< file "terminal" "command line" >}}
```bash
git checkout feature
git rebase master
```