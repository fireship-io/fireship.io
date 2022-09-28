---
title: Merge Conflicts
description: Merge conflicts and how to resolve them
weight: 32
lastmod: 2021-09-05T10:23:30-09:00
draft: false
vimeo: 599245272
emoji: ❌
video_length: 2:32
quiz: true
---

<quiz-modal options="--quit:--oops:--fml:--abort" answer="--abort" prize="17">
  <h5>Which flag allows you to safely quit the merge conflit process?</h5>
</quiz-modal>

## How Merge Conflicts Happen

Merge conflicts happen when two commits affect the same line of code at the same time. 

1. Feature branch modifies line 5 and commits. 
2. Master branch modifies line 5 and commits.
3. Master branch tries to merge feature branch.

Here's how a merge conflict looks from the command line:

{{< file "terminal" "command line" >}}
```bash
git branch feature
# make some changes
git commit -am "awesome branch stuff"

git checkout master
# make some changes to same code
git commit -am "master branch stuff"

git merge feature
# CONFLICT!
```

## Explore a Merge Conflict

Use git diff to compare the changes in the feature branch and master branch.

{{< file "terminal" "command line" >}}
```bash
git diff
```

## Fix a Merge Conflict

The easiest way to fix the merge conflict is use the editor to choose between the incoming changes (feature) or the existing changes (master). Then create a new *merge* commit with the changes you want to keep.

{{< file "terminal" "command line" >}}
```bash
# choose preferred code on master branch
git commit -am "resolved merge conflict"
```

If you're not sure, you can abort:

{{< file "terminal" "command line" >}}
```bash
git merge --abort
```