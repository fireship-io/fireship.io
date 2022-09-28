---
title: git push
description: Upload local code to GitHub
weight: 21
lastmod: 2021-09-05T10:23:30-09:00
draft: false
vimeo: 599117496
emoji: ☝️
video_length: 1:45
quiz: true
---

<quiz-modal options="upload:download:login:ping" answer="upload" prize="9">
  <h5><code>git push</code> is kinda like saying...</h5>
</quiz-modal>

Use git push to upload your local code to GitHub.

{{< file "terminal" "command line" >}}
```bash
git push origin master
```

Note: the `-u` flag is used to set origin as the upstream remote in your git config so git pull can be used without any arguments in the future.