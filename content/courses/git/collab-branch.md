---
title: git branch
description: Create a new branch in a git repository
weight: 30
lastmod: 2021-09-05T10:23:30-09:00
draft: false
vimeo: 599245578
emoji: 🌲
video_length: 2:05
chapter_start: Collaboration
chapter_icon: 🌲 
quiz: true
---

<quiz-modal options="apex:alpha:chief:main" answer="main" prize="15">
  <h5>What is a more politically correct name for the master branch?</h5>
</quiz-modal>

List out branches:

{{< file "terminal" "command line" >}}
```bash
git branch
```

Create a new branch:

{{< file "terminal" "command line" >}}
```bash
git branch awesome
```

Delete a branch

{{< file "terminal" "command line" >}}
```bash
git branch -d awesome
```