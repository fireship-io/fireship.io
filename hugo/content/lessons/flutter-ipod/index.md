---
title: "Flutter Ipod"
lastmod: 2019-11-29T09:12:43-07:00
publishdate: 2019-11-29T09:12:43-07:00
author: Jeff Delaney
draft: false
description: Build a throwback iPod UI with a click wheel scroller using Flutter.
tags: 
    - flutter

# youtube: 
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

## Demo

{{< vimeo 376306674 >}}

## Circular Scrolling

The most difficult aspect of this demo is building a circular shape that controls the a `ListView` or `PageView`. While the user scrolls clockwise it should move the view to the right, or when counterclockwise to the left. 

### Scroll Direction and Locations

In order build a scroll wheel, start by thinking of the circle separated into 4 quadrants, i.e. topLeft, topRight, bottomRight, and bottomLeft. 

Next, the direction the user is scrolling determines