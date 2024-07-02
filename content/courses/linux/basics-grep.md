---
title: Grep && Sed
description: Advanced text searching and manipulation techniques
weight: 18
lastmod: 2024-06-20T11:11:30-09:00
draft: false
vimeo: 973161216
emoji: 🔎
video_length: 3:08
quiz: true
---

<quiz-modal options="Universe:Mom:Hi Mom:empty string" answer="Universe" prize="8">
  <h6>What does the following command do?</h6>  
  <p><code>echo "Hi Mom" | grep -o "Mom" | sed 's/Mom/Universe/'</code></p>
</quiz-modal>

## Searching for Text with Grep

Search through a single file:

{{< file "cog" "command line" >}}
```bash
grep "mom" file.txt
```

Search through a directory recursively:

{{< file "cog" "command line" >}}
```bash
grep -r "mom" .
```

## Edit text with Sed

Run a find and replace operation with sed:

{{< file "cog" "command line" >}}
```bash
sed 's/mom/dad' file.txt
```


## Bonus Video

Learn more regex to match advanced patterns.

<div class="vid-center">
{{< youtube sXQxhojSdZM >}}
</div>
