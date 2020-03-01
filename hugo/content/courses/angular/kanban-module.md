---
title: Kanban Module
description: Kanban feature module setup
weight: 40
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 359141176
emoji: 🍱
chapter_start: Kanban
video_length: 2:10
---

Setup another lazy-loaded feature module for the development of Kanban boards. 

{{< file "terminal" "command line" >}}
{{< highlight text >}}
ng g module kanban --routing
ng g component kanban/board-list
{{< /highlight >}}

Add the necessary imports to the kanban module. 

{{< file "ngts" "kanban.module.ts" >}}
{{< highlight typescript >}}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KanbanRoutingModule } from './kanban-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    KanbanRoutingModule,
    SharedModule,
    FormsModule,
    DragDropModule,
    MatDialogModule,
    MatButtonToggleModule,
  ]
})
export class KanbanModule { }
{{< /highlight >}}


Lazy-load the kanban module. 

{{< file "ngts" "app-routing.module.ts" >}}
{{< highlight typescript >}}
const routes: Routes = [
  // ...
  {
    path: 'kanban',
    loadChildren: () =>
      import('./kanban/kanban.module').then(m => m.KanbanModule),
    canActivate: [AuthGuard]
  },
];
{{< /highlight >}}