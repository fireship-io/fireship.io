---
title: Firewall
description: How to open ports on your Firewall with ufw 
weight: 33
lastmod: 2024-06-20T11:11:30-09:00
draft: false
vimeo: 974265572
emoji: 🔥
video_length: 2:52
---

## Port Reference for this Project

The following ports are opened for external use: 

- 80 HTTP
- 443 HTTPS
- 22 SSH

These ports are only used internally, i.e by localhost:

- 3000 Next.js
- 8090 Pocketbase

## Setup Nginx

```
apt update
apt install nginx
systemctl start nginx
systemctl enable nginx
systemctl status nginx
```

## Uncomplicated Firewall

```
ufw status
ufw app list
ufw allow 'Nginx Full'
```