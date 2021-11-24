---
title: Tweak Settings
description: Customize your theme and add font ligatures
weight: 2
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🗛
vimeo: 645855281
video_length: 3:47
---

## Tasks

- Customize your color theme like [Atom One Dark](https://marketplace.visualstudio.com/items?itemName=akamud.vscode-theme-onedark)
- Update your Icon Theme with [VSCode-icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons)
- Add a custom font like [Fira Code](https://github.com/tonsky/FiraCode)

## ✨ Trick - Ligatures

Font ligatures are special symbols that combine multiple characters into a single symbol and *arguably* make your code more readable. Enable ligatures in VS Code by adding the following changes to your settings (note: you must install Fira Code font on your machine). 

{{< file "cog" "settings.json" >}}
```json
{
    "editor.fontFamily": "Fira Code",
    "editor.fontLigatures": true
}
```
