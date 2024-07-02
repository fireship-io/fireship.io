---
title: Process Management
description: Use tools like htop to manage Linux processes
weight: 19
lastmod: 2024-06-20T11:11:30-09:00
draft: false
vimeo: 973160909
emoji: 🪫
video_length: 3:08
---

## Managing Processes in Linux

List current processes:

{{< file "cog" "command line" >}}
```bash
ps

ps -ef
```

Kill a process:

{{< file "cog" "command line" >}}
```bash
kill PID # SIGTERM
kill -9 PID # SIGKILL
```

Use htop for a fully interactive process management experience: 

{{< file "cog" "command line" >}}
```bash
htop
```