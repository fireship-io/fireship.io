---
title: Routing
description: Manage dynamic routing and links in Next.js
weight: 14
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 508599188
emoji: 🚆
video_length: 4:54
---

## Routes

Create the following routes.

- `/enter` 
- `/[username]` 
- `/[username]/[slug]` 
- `/admin`
- `/admin/[slug]` 

## VS Code Component Snippet

Add your own [VS Code snippets](https://code.visualstudio.com/docs/editor/userdefinedsnippets)

{{< file "cog" "user-snippets.json" >}}
```json
{

	"component": {
		"scope": "javascript,typescript",
		"prefix": "next-page",
		"body": [
			"export default function Page({ }) {",
			"  return (",
			"    <main>",
			"    </main>",
			"  )",  
			"}",
		],
		"description": "React component"
	}
}
```