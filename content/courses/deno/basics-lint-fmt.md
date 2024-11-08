---
title: Clean Code
description: Clean up your code with fmt & lint
weight: 10
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027462597
emoji: 🧼
video_length: 2:17
---



## Customize Deno lint and fmt

{{< file "deno" "deno.json" >}}
```json
{
 "lint": {
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"],
    "rules": {
      "tags": ["recommended"],
      "include": ["ban-untagged-todo"],
      "exclude": ["no-unused-vars"]
    }
  },
  "fmt": {
    "useTabs": true,
    "lineWidth": 80,
    "indentWidth": 4,
    "semiColons": true,
    "singleQuote": true,
    "proseWrap": "preserve",
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"]
  }
}
```