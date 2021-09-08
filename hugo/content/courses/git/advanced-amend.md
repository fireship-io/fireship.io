---
title: git commit --amend
description: Update a commit message or add new files to last commit 
weight: 42
lastmod: 2021-09-05T10:23:30-09:00
draft: false
vimeo: 599244861
emoji: 🔧
video_length: 1:10
---

Update the message on your last commit:

{{< file "terminal" "command line" >}}
```bash
git commit --amend -m "better message"
```

Include a file you forgot on your last commit. 

{{< file "terminal" "command line" >}}
```bash
git add <your-file>
git commit --amend --no-edit
```
