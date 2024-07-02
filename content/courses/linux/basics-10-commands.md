---
title: 10 Essential Commands
description: Ten Linux commands and tricks you absolutely must know
weight: 10
lastmod: 2024-06-20T11:11:30-09:00
draft: false
vimeo: 973045131
emoji: 💪
video_length: 6:54
chapter_start: Terminal Mastery
quiz: true
free: true
---

<quiz-modal options="-a:-p:-r:-force" answer="-p" prize="1">
  <h6>Which flag would be used with <code>mkdir foo/bar/baz</code> to create all missing parent directories</h6>
</quiz-modal>

## Ten Linux Comands && Useful Tricks

**ls**

List all files, but sorted by size and print the size. 

{{< file "cog" "command line" >}}
```bash
ls -sS
```

**cd**

Move into the previous directory

{{< file "cog" "command line" >}}
```bash
cd -
```

**pwd**

Print the current working directory

{{< file "cog" "command line" >}}
```bash
pwd
```

**echo**

Print a value to the stardard output

{{< file "cog" "command line" >}}
```bash
echo "Hi Mom!"
```

**mkdir** 

Make a deeply nested directory and all it's parent directories

{{< file "cog" "command line" >}}
```bash
mkdir -p new_directory/subdirectory
```
**touch**

Create a new file

{{< file "cog" "command line" >}}
```bash
touch diary.txt
```
**rm**



{{< file "cog" "command line" >}}
```bash
rm diary.txt
rm -rf directory_to_remove # use carefully
```

**cat**

Read a file

{{< file "cog" "command line" >}}
```bash
cat diary.txt
```
**cp**

Copy a file or directory recursively

{{< file "cog" "command line" >}}
```bash
cp -r source_dir destination_dir
```

**mv**

Move or rename a file

{{< file "cog" "command line" >}}
```bash
mv diary.txt useless-ramblings.txt
```
