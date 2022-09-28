---
title: Modules
description: How NgModules help manage code and complexity
weight: 17
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 359307851
emoji: 🧩
free: true
video_length: 2:41
---

{{< file "terminal" "command line" >}}
```text
ng generate module cool
```

Get comfortable with declarations, imports, and exports. 

{{< file "ngts" "some.module.ts" >}}
```typescript
@NgModule({
  // Components defined in this module
  declarations: [
    FooComponent
  ],
  // Components used in this module
  imports: [
    CommonModule
  ],
  // Components that can be imported by other modules
  exports: [
    FooComponent
  ],
})
```
