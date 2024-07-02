---
title: Bash Config
description: How to make your Linux terminal look cool
weight: 16
lastmod: 2024-06-20T11:11:30-09:00
draft: false
vimeo: 973161558
emoji: 🎨
video_length: 2:31
---

## 7 Examples of PS1 Customization

Make your terminal prompt look cool like a true linux hacker by trying these examples:

{{< file "cog" "~/.bashrc" >}}
```bash
# Jeff's favorite prompt
PS1='\[\e[01;35m\]\W\[\e[m\] ❯ '

# Minimal
PS1='\u:\W $ '

# Minimal with git branch
PS1='\W$(__git_ps1 " (%s)") $ '

# Two line prompt with git branch
PS1='\n\[\033[01;32m\]\u@\h\[\033[00m\] \[\033[01;34m\]\w\[\033[00m\] $(__git_ps1 "(%s)")\n\$ '

# Colorful prompt
PS1='\[\033[01;32m\]\u\[\033[00m\]@\[\033[01;36m\]\h\[\033[00m\] \[\033[01;34m\]\w\[\033[00m\] \[\033[01;33m\][\t]\[\033[00m\] \[\033[01;31m\]$(if [[ $? == 0 ]]; then echo "✓"; else echo "✗"; fi)\[\033[00m\]\n\$ '

# Retro Style
PS1='\[\033[01;32m\][\[\033[01;36m\]\u\[\033[01;32m\]@\[\033[01;36m\]\h\[\033[01;32m\]] \[\033[01;34m\]\w\[\033[00m\] \$ '

# Customized based on time of day with emojis
PS1='$(if [ $(date +%H) -lt 12 ]; then echo "🌅"; elif [ $(date +%H) -lt 18 ]; then echo "☀️"; else echo "🌙"; fi) \[\033[01;32m\]\u\[\033[00m\] in \[\033[01;34m\]\w\[\033[00m\] \$ '
```