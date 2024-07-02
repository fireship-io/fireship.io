---
title: The File System
description: Every Linux directory explained
weight: 11
lastmod: 2024-06-20T11:11:30-09:00
draft: false
vimeo: 973045264
emoji: 🗃️
video_length: 4:02
quiz: true
---

<quiz-modal options="/etc/log:/home/apps/log:/log:/var/log" answer="/var/log" prize="2">
  <h6>You wrote an application and want to host it on your server. Where should you save your log files?</h6>
</quiz-modal>

## The Linux File System Cheat Sheet

{{< figure src="/courses/linux/img/linux-file-system.png" caption="Linux file system diagram" >}}

- **/ (root):** The primary hierarchy for the entire file system.
- **/boot:** Contains files needed to boot the system.
- **/dev:** Contains device files that represent hardware components.
- **/usr:** Contains user-related programs and data.
- **/bin:** Contains essential user binaries (commands).
- **/sbin:** Contains essential system binaries (commands).
- **/home:** Contains home directories for users.
- **/lib:** Contains essential shared libraries for system binaries.
- **/tmp:** Contains temporary files.
- **/var:** Contains variable data like logs and caches.
- **/etc:** Contains system-wide configuration files.
- **/proc:** Contains virtual files that represent system and process information.
- **/usr/local:** Contains user-installed software.
- **/home/bob** and **/home/alice:** Home directories for users Bob and Alice.