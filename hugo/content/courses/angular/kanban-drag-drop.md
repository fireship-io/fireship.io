---
title: CDK Drag and Drop
description: Add drag and drop capabilities to a Material Card
weight: 43
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 359157470
emoji: 🍱
video_length: 6:36
---

Use the Angular [CDK Drag and Drop](https://material.angular.io/cdk/drag-drop/overview) Module to enable reordering of Kanban boards and tasks. 

## Steps

### Step 1 - Initial Setup

{{< file "terminal" "command line" >}}
{{< highlight text >}}
ng g c kanban/board-list
ng g c kanban/board
{{< /highlight >}}

Point the kanban router to the board list

{{< file "ngts" "kanban-routing.module.ts" >}}
{{< highlight typescript >}}
import { BoardListComponent } from './board-list/board-list.component';


const routes: Routes = [
  { path: '', component: BoardListComponent }
];

{{< /highlight >}}

### Step 2 - Board List

{{< file "ngts" "board-list.component.ts" >}}
{{< highlight typescript >}}
import { Component, OnInit, OnDestroy  } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { Board } from '../board.model';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss']
})
export class BoardListComponent implements OnInit, OnDestroy {
  boards: Board[];
  sub: Subscription;

  constructor(public boardService: BoardService) {}

  ngOnInit() {
    this.sub = this.boardService
      .getUserBoards()
      .subscribe(boards => (this.boards = boards));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.boards, event.previousIndex, event.currentIndex);
    this.boardService.sortBoards(this.boards);
  }

}
{{< /highlight >}}

{{< file "html" "board-list.component.html" >}}
{{< highlight html >}}
<div
  cdkDropList
  cdkDropListOrientation="horizontal"
  class="boards"
  (cdkDropListDropped)="drop($event)"
>
  <app-board cdkDrag *ngFor="let board of boards" [board]="board">
    <mat-icon cdkDragHandle class="handle">drag_indicator</mat-icon>
  </app-board>

  <div class="board-button">
    <button
      mat-raised-button
      color="accent"
      cdkDragDisabled
    >
      New Board
    </button>
  </div>
</div>
{{< /highlight >}}

### Step 2 - Board

{{< file "ngts" "board.component.ts" >}}
{{< highlight typescript >}}
import { Component, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  @Input() board;

  constructor(private boardService: BoardService) {}

  taskDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.board.tasks, event.previousIndex, event.currentIndex);
    this.boardService.updateTasks(this.board.id, this.board.tasks);
  }
}

{{< /highlight >}}

{{< file "html" "board.component.html" >}}
{{< highlight html >}}
<mat-card class="outer-card">
  <mat-card-header>
    <!-- Slot for the handle -->
    <ng-content></ng-content>
    <mat-card-title>
      {{ board.title }}
    </mat-card-title>
    <mat-card-subtitle>
      {{ board.id }}
    </mat-card-subtitle>
  </mat-card-header>

  <div
    class="tasks"
    cdkDropList
    cdkDropListOrientation="vertical"
    (cdkDropListDropped)="taskDrop($event)"
  >
    <div
      class="inner-card"
      cdkDrag
      *ngFor="let task of board.tasks; let i = index"
    >
      <mat-card [ngClass]="task.label"> {{ task.description }} </mat-card>
    </div>
  </div>
</mat-card>
{{< /highlight >}}