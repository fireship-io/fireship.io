---
title: Dialogs
description: Create, update, delete data from a Material Dialog modal popup
weight: 45
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 359165026
emoji: 🍱
video_length: 8:03
---

Use Material dialogs to create and update the data associated with boards and tasks. 

## Steps 

### Generate the Dialogs

{{< file "terminal" "command line" >}}
```text
ng g c kanban/dialogs/board-dialog --flat --entry-component -s -t
ng g c kanban/dialogs/task-dialog --flat --entry-component -s -t
```

### Step 2 - Board Dialog

Create the board dialog component.

{{< file "ngts" "board-dialog.component.ts" >}}
```typescript
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-board-dialog',
  template: `
    <h1 mat-dialog-title>Board</h1>
    <div mat-dialog-content>
    <p>What shall we call this board?</p>
      <mat-form-field>
        <input placeholder="title" matInput [(ngModel)]="data.title" />
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-button [mat-dialog-close]="data.title" cdkFocusInitial>
        Create
      </button>
    </div>
  `,
  styles: []
})
export class BoardDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BoardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

```

Then trigger it from the board-list component and handle the data accordingly. Below are the relevant changes to the existing code:  

{{< file "ngts" "board-list.component.ts" >}}
```typescript
// ... omitted
import { MatDialog } from '@angular/material/dialog';
import { BoardDialogComponent } from '../dialogs/board-dialog.component';

@Component(...)
export class BoardListComponent implements OnInit, OnDestroy {
  boards: Board[];
  sub: Subscription;

  constructor(public boardService: BoardService, public dialog: MatDialog) {}

  // ... omitted

  openBoardDialog(): void {
    const dialogRef = this.dialog.open(BoardDialogComponent, {
      width: '400px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.boardService.createBoard({
          title: result,
          priority: this.boards.length
        });
      }
    });
  }
}
```

And make sure to bind the button click to the `openDialog()` handler. 

{{< file "html" "board-list.component.html" >}}
```html
<button
    mat-raised-button
    cdkDragDisabled
    (click)="openBoardDialog()"
>
    New Board
</button>
```

### Step 3 - Task Dialog

The task dialog is similar, but also supports data updates by passing data into the material dialog. 

{{< file "ngts" "task-dialog.component.ts" >}}
```typescript
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-task-dialog',
  template: `
  <h1 mat-dialog-title>Task</h1>
  <div mat-dialog-content class="content">
    <mat-form-field>
      <textarea
        placeholder="Task description"
        matInput
        [(ngModel)]="data.task.description"
      ></textarea>
    </mat-form-field>
    <br />
    <mat-button-toggle-group
      #group="matButtonToggleGroup"
      [(ngModel)]="data.task.label"
    >
      <mat-button-toggle *ngFor="let opt of labelOptions" [value]="opt">
        <mat-icon [ngClass]="opt">{{
          opt === 'gray' ? 'check_circle' : 'lens'
        }}</mat-icon>
      </mat-button-toggle>
    </mat-button-toggle-group>
  </div>
  <div mat-dialog-actions>
    <button mat-button [mat-dialog-close]="data" cdkFocusInitial>
      {{ data.isNew ? 'Add Task' : 'Update Task' }}
    </button>

  </div>
  `,
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent {

  labelOptions = ['purple', 'blue', 'green', 'yellow', 'red', 'gray'];

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    private ps: BoardService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleTaskDelete() {
    this.ps.removeTask(this.data.boardId, this.data.task);
    this.dialogRef.close();
  }
}
```


Update the board component to pass task data to the dialog, then handle the changes the user enters into the form input. 

{{< file "ngts" "board.component.ts" >}}
```typescript
// ...omitted
import { Task } from '../board.model';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../dialogs/task-dialog.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  @Input() board;

  constructor(private boardService: BoardService, private dialog: MatDialog) {}

  taskDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.board.tasks, event.previousIndex, event.currentIndex);
    this.boardService.updateTasks(this.board.id, this.board.tasks);
  }


  openDialog(task?: Task, idx?: number): void {
    const newTask = { label: 'purple' };
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: task
        ? { task: { ...task }, isNew: false, boardId: this.board.id, idx }
        : { task: newTask, isNew: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.isNew) {
          this.boardService.updateTasks(this.board.id, [
            ...this.board.tasks,
            result.task
          ]);
        } else {
          const update = this.board.tasks;
          update.splice(result.idx, 1, result.task);
          this.boardService.updateTasks(this.board.id, this.board.tasks);
        }
      }
    });
  }
}
```

Update the board component template to open the dialog. 

{{< file "html" "board.component.html" >}}
```html

<div 
    class="inner-card"
    cdkDrag
    *ngFor="let task of board.tasks; let i = index"
    (click)="openDialog(task, i)"
>
    <!-- omitted -->
</div>

<button mat-stroked-button (click)="openDialog()">
    <mat-icon>add</mat-icon>
</button>
```