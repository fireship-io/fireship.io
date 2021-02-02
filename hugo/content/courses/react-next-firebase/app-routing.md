---
title: Routing
description: How routing works in Next.js
weight: 14
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 
emoji: 🚆
video_length: 11:47
---

## Routes

Create the following routes.

- `/enter` 
- `/[username]` 
- `/[username]/[slug]` 
- `/admin`
- `/admin/[slug]` 

## VS Code Component Snippet

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