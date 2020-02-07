---
title: How to Participate on Github
lastmod: 2019-01-17T05:42:54-07:00
publishdate: 2019-01-17T05:42:54-07:00
author: Jeff Delaney
draft: false
description: A step-by-step guide to submitting your first Pull Request on Github. Practical tips and advice for git version control. 
tags: 
    - git

type: lessons

youtube: HkdAHXoRtos
github: https://github.com/codediodeio/gimmie-sticker 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

Contributing to open-source is satisfying on many levels. Not only does it validate your skills for recruiters, but it leads to higher quality software that empowers developers to build better products. But submitting your first pull request on GitHub can be intimidating. The goal of this guide is to give you a clear set of steps for contributing any OS project (like fireship.io 🔥). 

This guide assumes that you have a [Github](https://github.com/) account and [git installed](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) on your machine. 

## Step 1: Fork

After you find a repo that looks cool, the first step is to fork it. A fork will create a copy of the repo under your account that you can modify, while maintaining a link to original (that's called the upstream repo). 

{{< figure src="/img/snippets/git-fork.png" alt="clicking the git fork button on github" >}}


## Step 2: Clone

Now let's download the code to your local machine by cloning the fork. 

{{< file "terminal" "command line" >}}
{{< highlight text >}}
git clone <your-fork-url.git>
{{< /highlight >}}

You should now have a directory for your project that can be opened with your [preferred code editor](https://code.visualstudio.com/). 

## Step 3: Branch

A git repo is just a big tree 🌳. You might have hundreds of people working on the same project and branches ensure that collaboration can happen without complete chaos. Changes on your branch are isolated from the work everybody else is doing.

{{< file "terminal" "command line" >}}
{{< highlight text >}}
git checkout -b my-cool-thing
{{< /highlight >}}

At this point you can start making changes to the code.

## Step 4: Commit 

When you are happy with the changes, you can stage the changes and commit the code. 

{{< file "terminal" "command line" >}}
{{< highlight text >}}
git add .
git commit -m "🚀 I made this software better!"
{{< /highlight >}}


## Step 5: Pull Request

A "pull request" is identical to a "git merge", but it is requested from an external source - you. In fact, it is called a "merge request" on other platforms, which I think is a better name, but I digress. 

Let's push your branch to your fork.

{{< file "terminal" "command line" >}}
{{< highlight text >}}
git push origin my-cool-thing
{{< /highlight >}}

When you go back to Github you should automatically see a button labeled **Create New Pull Request for my-cool-thing**. Go ahead and push that button. Add additional details as needed and it will show up in the list of PRs once submitted. 

{{< figure src="/img/snippets/git-pr.png" alt="pull requests on a github repo" >}}

{{< box icon="github" class="box-blue" >}}
Many larger projects have their own "Contributor Guidelines" and may require you to sign a [CLA](https://en.wikipedia.org/wiki/Contributor_License_Agreement) before participating. 
{{< /box >}}

## Submit your First PR?

Fireship.io is an open source project, which means you can submit a change for the very web page you are reading right now. If you are looking for some real-world practice, feel free to add a sentence, a typo fix, an emoji, or any other improvement to the pages on this site (see link in footer to go directly to the source file). 

{{< figure src="/img/snippets/git-first-pr.png" alt="pull requests on a github repo" >}}
