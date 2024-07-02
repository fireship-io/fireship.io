---
title: Sudo
description: Run commands with elevated privileges with sudo
weight: 14
lastmod: 2024-06-20T11:11:30-09:00
draft: false
vimeo: 973161754
emoji: 🦸
video_length: 1:35
quiz: true
---

<quiz-modal options="true:false" answer="true" prize="5">
  <h6>Additional users can be given sudo abilities in the <code>/etc/sudoers</code> file</h6>  
</quiz-modal>

## Change a File's Owner

Change the owner of a file:

{{< file "cog" "command line" >}}
```bash
chown other_user somefile.txt
```

Change the owner of a file to root:

{{< file "cog" "command line" >}}
```bash
chown root somefile.txt
```

## Execute a command with root privileges 

Change the owner of a file to root:

{{< file "cog" "command line" >}}
```bash
sudo chown root somefile.txt
```