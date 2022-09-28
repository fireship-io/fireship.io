---
title: Delete Button
description: Create a confirmable delete button
weight: 46
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 359176203
emoji: 🗑️
video_length: 3:10
---

Create a delete button that confirms the operation before sending the write to the database. 

## Steps

### Step 1 - Generate the Component

{{< file "terminal" "command line" >}}
```text
ng g c shared/delete-button
```

### Step 2 - Delete Button Component

The delete button component is just UI (dumb component), meaning it only emits an event with the user's delete intention. The parent component handles the actual database write. 

{{< file "ngts" "delete-button.component.ts" >}}
```typescript
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.scss']
})
export class DeleteButtonComponent {
  canDelete: boolean;

  @Output() delete = new EventEmitter<boolean>();

  prepareForDelete() {
    this.canDelete = true;
  }

  cancel() {
    this.canDelete = false;
  }

  deleteBoard() {
    this.delete.emit(true);
    this.canDelete = false;
  }

}
```

{{< file "html" "delete-button.component.html" >}}
```html
<button
  mat-button
  color="warn"
  (click)="canDelete ? deleteBoard() : prepareForDelete()"
>
  <mat-icon>delete</mat-icon>
  <span *ngIf="canDelete">confirm</span>
</button>

<button *ngIf="canDelete" mat-button (click)="cancel()">
  Cancel
</button>

```


### Step 3 - Use it in the Kanban Feature

Example usage to delete a board:


{{< file "ngts" "board.component.ts" >}}
```typescript
  handleDelete() {
    this.boardService.deleteBoard(this.board.id);
  }
```

{{< file "html" "board.component.html" >}}
```html
<app-delete-button (delete)="handleDelete()"></app-delete-button>
```
