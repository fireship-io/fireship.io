---
title: Intro to Angular
description: A high-level overview of Angular
weight: 17
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 359307851
emoji: 🧩
---

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
ng generate module cool
{{< /highlight >}}

Get comfortable with declarations, imports, and exports. 

{{< file "ngts" "some.module.ts" >}}
{{< highlight typescript >}}
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
{{< /highlight >}}
