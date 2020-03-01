---
title: Drag and Drop Animation
description: Animate the CDK Drag and Drop events with CSS transitions
weight: 44
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 359159386
emoji: 🍱
video_length: 3:06
---

Animate the the CDK Drag & Drop elements using CSS transitions.


## Full Styles

- [board.scss](https://github.com/codediodeio/angular-firestarter/blob/master/src/app/kanban/board/board.component.scss)
- [boards-list.scss](https://github.com/codediodeio/angular-firestarter/blob/master/src/app/kanban/boards-list/boards-list.component.scss)

## Animation Styles

### Board List

{{< file "html" "board-list.component.scss" >}}
{{< highlight html >}}
.cdk-drag-placeholder {
  opacity: 0.2;
  width: 350px;
  border: 5px dashed gray;
  margin: 0 10px;
}


.cdk-drag-animating {
  transition: transform 300ms ease;
}

.cdk-drop-list-dragging .cdk-drag {
  transition: transform 300ms ease;
}
{{< /highlight >}}

### Board


{{< file "html" "board.component.scss" >}}
{{< highlight html >}}
.cdk-drag-placeholder {
  opacity: 0.5;
}

.cdk-drag-animating {
  transition: transform 300ms ease;
}

.cdk-drop-list-dragging .cdk-drag {
  transition: transform 300ms ease;
}

.blue { background: #71deff; color: black; }
.green { background: #36e9b6; color: black;  }
.yellow { background: #ffcf44; color: black; }
.purple { background: #b15cff; }
.red { background: #e74a4a; }
.gray { background: gray; text-decoration: line-through; }
{{< /highlight >}}

