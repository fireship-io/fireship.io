---
title: git remote
description: Connect a remote GitHub repo to your local repo
weight: 20
lastmod: 2021-09-05T10:23:30-09:00
draft: false
vimeo: 599117582
emoji: ☁️
video_length: 1:40
chapter_start: Remote 
chapter_icon: ☁️ 
quiz: true
---

<quiz-modal options="Atlassian:Google:Microsoft:McDonalds" answer="Microsoft" prize="12">
  <h5>What is the parent company of GitHub?</h5>
</quiz-modal>

## List Remotes

List current remotes in the local repo:

{{< file "terminal" "command line" >}}
```bash
git remote
```

## Create a new remote

{{< file "terminal" "command line" >}}
```bash
git remote add origin <url-to-your-github-repo>
```