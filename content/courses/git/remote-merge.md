---
title: git merge
description: Merge code from two different sources
weight: 22
lastmod: 2021-09-05T10:23:30-09:00
draft: false
vimeo: 599117280
emoji: 🤝
video_length: 1:44
quiz: true
---

<quiz-modal options="recursive:octopus:renormalize:fast forward" answer="fast forward" prize="10">
  <h5>What is the most common merge strategy?</h5>
</quiz-modal>

Fetch and merge code from the remote repository.

{{< file "terminal" "command line" >}}
```bash
git fetch
git merge origin/master
```