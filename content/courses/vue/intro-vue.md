---
title: Vue Setup
description: Get started with the Vue CLI
weight: 12
lastmod: 2020-04-01T10:23:30-09:00
draft: false
vimeo: 403196601
emoji: ⚡
free: true
video_length: 3:43
---

## Install the Vue CLI Globally

[CLI Docs](https://cli.vuejs.org/)

{{< file "terminal" "command line" >}}
```text
npm install -g @vue/cli 
```

## Run the Vue UI App

{{< file "terminal" "command line" >}}
```text
vue ui
```

## Add Bulma for Better Styling

{{< file "html" "public/index.html" >}}
```html
<head>

    <!-- add this line -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css">

</head>
```