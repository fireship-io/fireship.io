---
title: SSH
description: Connect to a remote server securely with SSH
weight: 31
lastmod: 2024-06-20T11:11:30-09:00
draft: false
vimeo: 974264137
emoji: 🗝️
video_length: 2:35
---

## Connect your your VPS

```bash
ssh root@your.ip.address
```

## Create an SSH Key

Use an SSH key to access your server without needing to enter the root password. 

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```