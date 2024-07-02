---
title: Env Vars
description: The many ways to configure Environment Variables in Linux
weight: 37
lastmod: 2024-06-20T11:11:30-09:00
draft: false
vimeo: 974264942
emoji: 🍱
video_length: 1:44
---

## 1. Export

This will setup an environment variable temporarily for the life of the shell session

```bash
export FOO="bar"
```

## 2. Bash

Update the .bashrc or .bash_profile to set the variable before every shell session. 

```bash
nano ~/.bashrc
export FOO="bar"
```

## 3. System Environment

Set it permanently system wide.

```bash
nano /etc/environment
export FOO="bar"
```

## 4. .env

Create a `.env` file in one of your project directories. Your application may need a library like `dotenv` in Node.js to read the value. 

```bash
export FOO="bar"
```

## 5. Systemd

See next video for setting environment variables with Systemd. 