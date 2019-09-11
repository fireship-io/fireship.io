---
title: Dependency Injection and Services
description: What is dependency injection (DI) and why is it so useful?
weight: 17
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 359307600
emoji: 💉
youtube:
---

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
ng g service clock
{{< /highlight >}}

## Use cases for Services

Services can be used to share data and write code that follows DRY separation of concens practices. 

- Shared state. Services can connect data between components and are especially useful when components are not in a child/parent relationship. 
- Shared logic. Stateless services that define common methods used in multiple components. 