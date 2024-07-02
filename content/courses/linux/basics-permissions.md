---
title: File Permissions
description: How read, write, execute permissions work 
weight: 13
lastmod: 2024-06-20T11:11:30-09:00
draft: false
vimeo: 973045593
emoji: 🔐
video_length: 3:01
quiz: true
---

<quiz-modal options="gives owner read/write access:removes owner write/execute access:gives others read/execute access:removes others write/execute access" answer="removes others write/execute access" prize="4">
  <h6>What will <code>chmod o-wx file.txt</code> do to existing file permissions?</h6>  
</quiz-modal>


{{< figure src="/courses/linux/img/linux-file-permissions.png" caption="File permission triplets in Linux" >}}


## Show File Permissions

Use the `-l` flag to show file permissions:

{{< file "cog" "command line" >}}
```bash
ls -l
```

## Change File Permissions

Add write access to a group

{{< file "cog" "command line" >}}
```bash
chmod g+w somefile.txt
```

Remove write access to a group:

{{< file "cog" "command line" >}}
```bash
chmod g-w somefile.txt
```


Add a specific file permission config, like readonly:

{{< file "cog" "command line" >}}
```bash
chmod g=r somefile.txt
```


Update file permissions with octal notation: 

{{< file "cog" "command line" >}}
```bash
chmod 644 somefile.txt
```

Check out the [chmod calculator](https://chmod-calculator.com/) to configure specific file permissions settings easily. 