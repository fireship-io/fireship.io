---
title: Tar & Gzip
description: File compression and directory archiving magic 
weight: 21
lastmod: 2024-06-20T11:11:30-09:00
draft: false
vimeo: 973160544
emoji: 🪄
video_length: 3:08
---

## Compress with Gzip

{{< file "cog" "command line" >}}
```bash
gzip somefile.txt

gzip -d somefile.txt.gz
```

## Archive with Tar

{{< file "cog" "command line" >}}
```bash
tar -cvf archive.tar /path/to/dir

tar -czvf archive.tar.gz /path/to/dir

tar -xzf archive.tar.gz
```


## Bonus Video

<div class="vid-center">
{{< youtube NLtt4S9ErIA >}}
</div>
