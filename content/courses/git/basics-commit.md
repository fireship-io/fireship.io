---
title: git commit
description: Commit files to a repository
weight: 14
lastmod: 2021-09-05T10:23:30-09:00
draft: false
vimeo: 599073569
emoji: 📸
video_length: 2:05
quiz: true
---

<quiz-modal options="---preview:--blank:--dry-run:--test" answer="--dry-run" prize="8">
  <h6>How might you preview or try a commit before making it official?</h6>
</quiz-modal>

Commit staged files to a repository

{{< file "terminal" "command line" >}}
```bash
git commit -m "initial commit 🚀"
```

Tip: Add files and commit in a single command

{{< file "terminal" "command line" >}}
```bash
git commit -a -m "additional commit"

# or

git commit -am "additional commit"
```

Use git log to see the history of commits:

```bash
git log
```