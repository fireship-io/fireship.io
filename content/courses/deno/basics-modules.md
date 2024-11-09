---
title: Modules
description: How modules work in Deno
weight: 4
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027462441
emoji: 📦
video_length: 4:58
quiz: true
---

<quiz-modal options="NPM:node_modules:JSR:silk road" answer="JSR" prize="5">
  <h5>What is the preferred package registry for Deno projects?</h5>
</quiz-modal>


## Create your Own ES Modules

#### Default Export 

```ts
export default function foo() {
    console.log('foo')
}
```

#### Named Export

```ts
export function bar() {
    console.log('bar')
}
```

#### Import

```ts
import foo from "./a.ts";
import { bar } from "./b.ts";
```


## Customizing the Import Names

```ts
import customFoo from "./a.ts";
import { bar as customBar } from "./b.ts";
```

## JSR

```ts
import { toCamelCase } from "jsr:@std/text"

console.log(toCamelCase('Make me a camel'))
```

## Challenge

```ts
const record = { a: "x", b: "y", c: "z" };
```