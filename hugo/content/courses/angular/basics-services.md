---
title: Dependency Injection and Services
description: What is dependency injection (DI) and why is it so useful?
weight: 17
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 359307600
emoji: 💉
youtube:
free: true
video_length: 3:18
---

## Generate a Service

{{< file "terminal" "command line" >}}
{{< highlight text >}}
ng g service clock
{{< /highlight >}}

## Use-Cases for Services

Services can inject shared data and methods into your components. They are also useful for writing code that maintains a DRY separation of concerns. 

- Shared state. Services can connect data between components and are especially useful when components are not in a child/parent relationship. 
- Shared logic. Stateless services that define common methods used in multiple components. 
