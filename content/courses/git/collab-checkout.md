---
title: git checkout
description: Move between branches in git
weight: 31
lastmod: 2021-09-05T10:23:30-09:00
draft: false
vimeo: 599245523
emoji: 👀
video_length: 1:35
quiz: true
---

<quiz-modal options="-n:-b:--add:--new" answer="-b" prize="16">
  <h5>Which flag automatically creates a new branch during checkout?</h5>
</quiz-modal>

Move into a branch

{{< file "terminal" "command line" >}}
```bash
git checkout awesome
```

Create a new branch and move into it:

{{< file "terminal" "command line" >}}
```bash
git checkout -b awesome
```