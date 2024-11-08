---
title: Under the Hood
description: A quick look at Deno internals
weight: 1
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027305709
emoji: 🦕
video_length: 3:25
chapter_start: Welcome to Deno
free: true
---

## How Deno Works

Deno is built with the V8 JavaScript engine (the same engine powering Chrome) and uses Rust to implement browser standard APIs, providing both performance and safety. Internally, Deno manages JavaScript and TypeScript code execution via an event loop, similar to Node.js, but it emphasizes modern language features and security by default. 

Deno's runtime executes code in a secure, sandboxed environment where all filesystem, network, and environment access require explicit permissions, enhancing security. Deno uses a single-process architecture with asynchronous event handling, and its native support for TypeScript is built directly into the runtime, bypassing the need for external transpilers. Additionally, Deno has a built-in dependency inspector and a module loader, streamlining dependency management by fetching and caching modules from remote sources, much like a web browser does for resources. This architecture makes Deno lightweight, secure, and ideal for backend JS applications.


## The Internals of Deno Book

Check out this [free book](https://choubey.gitbook.io/internals-of-deno) for a deep dive into Deno under the hood

## Bonus Video - How V8 JavaScript Works



<div class="vid-center">
{{< youtube FSs_JYwnAdI >}}
</div>