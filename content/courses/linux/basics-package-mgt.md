---
title: Package Managers
description: How to install packages from source
weight: 22
lastmod: 2024-06-20T11:11:30-09:00
draft: false
vimeo: 973160413
emoji: 📦
video_length: 3:28
---

## Install from Source

Apex-alpha-giga-chad Linux users prefer to install from source:

{{< file "cog" "command line" >}}
```bash
git clone https://github.com/mtoyoda/sl.git
cd sl

make
./sl

# Move binary to /usr/local/bin
sudo mv ./sl /usr/local/bin
```

## Install from Compiled Binary

{{< file "cog" "command line" >}}
```bash
wget https://path-to-some/package.deb
sudo dpkg -i package.deb
```

## Install with Package Manager

{{< file "cog" "command line" >}}
```bash
sudo apt update
sudo apt install sl
```