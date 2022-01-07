---
title: Install
description: How to install git on Windows, Mac, or Linux
weight: 10
lastmod: 2021-09-05T10:23:30-09:00
draft: false
vimeo: 599073861
emoji: 💿
video_length: 1:51
free: true
---

Check your machine's current git version:

{{< file "terminal" "command line" >}}
```bash
git config --global user.name "Jeff Delaney"
git config --global user.email "hello@fireship.io"
```

## Set a Username & Email

{{< file "terminal" "command line" >}}
```bash
git config --list 
```

## Windows Installation

On Windows, I recommend downloading [Git for Windows](https://gitforwindows.org/). In addition, you may want to use git-bash as your terminal (like me), but that is optional - and check out [bash in 100 seconds](https://youtu.be/I4EWvMFj37g).


## Mac Installation

On MacOS, I recommend installing git with [Homebrew](https://brew.sh/).

{{< file "terminal" "command line" >}}
```bash
brew install git
```

## Linux Installation

See install instructions for [Linux](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).