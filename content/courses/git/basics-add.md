---
title: git add
description: Staging changes to be committed
weight: 13
lastmod: 2021-09-05T10:23:30-09:00
draft: false
vimeo: 599073543
emoji: ➕
video_length: 1:19
quiz: true
---

<quiz-modal options="Staging:Master:Stack:Main" answer="Staging" prize="7">
  <h5>What do we call the area for files that will be part of the next commit?</h5>
</quiz-modal>

Add an entire working directory to the staging area:

{{< file "terminal" "command line" >}}
```bash
git add .
```

Add a single file:

{{< file "terminal" "command line" >}}
```bash
git add somefile.txt
```

Remove a file from the staging area:

{{< file "terminal" "command line" >}}
```bash
git reset .
```
