---
title: CSS Grid Layout Examples
lastmod: 2020-03-08T11:04:48-07:00
publishdate: 2020-03-08T11:04:48-07:00
author: Jeff Delaney
draft: false
description: Build three different responsive CSS grid layouts from scratch
tags:
    - css

youtube: 705XCEruZFs
github: https://github.com/fireship-io/224-animated-css-grid
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

The following lesson contains three examples of CSS Grid layouts.


## Bootstrap-Style 12 Column Grid

Grid can significantly reduce the amount of code required to build responsive row/column layouts. Unlike a flex-based grid like Bootstrap, it does not require a bunch of classes in the markup to make the children responsive.

The grid below is an example of an *implicit* grid because we do not know the exact number of rows or columns in advance. Instead, we let CSS fill the available space based on the device size.

### HTML

{{< file "html" "index.html" >}}
```html
    <section class="basic-grid">
        <div class="card">1</div>
        <div class="card">2</div>
        <div class="card">3</div>
        <div class="card">4</div>
        <div class="card">5</div>
        <div class="card">6</div>
        <div class="card">7</div>
        <div class="card">8</div>
        <div class="card">9</div>
        <div class="card">10</div>
        <div class="card">11</div>
        <div class="card">12</div>
    </section>
```

### CSS

{{< file "css" "style.css" >}}
```css
.basic-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
 }
```


## Responsive Photo Gallery

The next grid is a responsive photo gallery where photos can take up multiple cells. Like the previous example, it is also an implicit grid.

### HTML

{{< file "html" "index.html" >}}
```html
<div class="photo-grid">
      <div class="card" style="background-image: url('some-image-URL')">
        1
      </div>
      <div class="card card-tall" style="background-image: url('some-image-URL')">
        2
      </div>
      <div class="card card-wide" style="background-image: url('some-image-URL')">
        3
      </div>

    <!-- Add more items here  -->

</div>
```


### CSS

{{< file "css" "style.css" >}}
```css
.photo-grid {
  display: grid;
  gap: 1rem;

  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  grid-auto-rows: 240px;
}

/* Medium screens */
@media screen and (min-width: 600px) {
  .card-tall {
    grid-row: span 2 / auto;
  }

  .card-wide {
    grid-column: span 2 / auto;
  }
}
```

## Animated Explicit Grid

The third grid example is a 4x4 explicit grid where each element is placed in specific area by name. The `grid-template-areas` property can position elements in the grid by matching the `grid-area` property on the children.

<div class="vid vid-center">
    {{< vimeo 396318960 >}}
</div>

### HTML

{{< file "html" "index.html" >}}
```html
<section class="animated-grid">
    <div class="card">a</div>
    <div class="card">b</div>
    <div class="card">c</div>
    <div class="card">d</div>
    <div class="card">e</div>
    <div class="card">f</div>
    <div class="card">g</div>
    <div class="card">h</div>
    <div class="card">i</div>
    <div class="card">j</div>
    <div class="card">k</div>
    <div class="card">l</div>
    <div class="card">main</div>
</section>
```


### CSS

{{< file "css" "style.css" >}}
```css
.animated-grid {
  height: 85vh;
  margin-bottom: 200px;

  display: grid;
  gap: 1rem;

  /* Explicit grid */
  grid-template-areas:
    'a  b  c  d'
    'l  🌟 🌟 e'
    'k  🌟 🌟 f'
    'j  i  h  g';

  grid-template-rows: repeat(4, 25%);
  grid-template-columns: 240px auto auto 240px;

  --stagger-delay: 100ms;
}

@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: scale(0.3);
    filter: hue-rotate(180deg);
  }
  to {
    opacity: 1;
    transform: scale(1);
    filter: hue-rotate(0deg);
  }
}

.card {
  background-color: rgb(36, 243, 147);
  animation: cardEntrance 700ms ease-out;
  animation-fill-mode: backwards;
}

.card:nth-child(1) {
  grid-area: a;
  animation-delay: calc(1 * var(--stagger-delay));
}
.card:nth-child(2) {
  grid-area: b;
  animation-delay: calc(2 * var(--stagger-delay));
}
.card:nth-child(3) {
  grid-area: c;
  animation-delay: calc(3 * var(--stagger-delay));
}
.card:nth-child(4) {
  grid-area: d;
  animation-delay: calc(4 * var(--stagger-delay));
}
.card:nth-child(5) {
  grid-area: e;
  animation-delay: calc(5 * var(--stagger-delay));
}
.card:nth-child(6) {
  grid-area: f;
  animation-delay: calc(6 * var(--stagger-delay));
}
.card:nth-child(7) {
  grid-area: g;
  animation-delay: calc(7 * var(--stagger-delay));
}
.card:nth-child(8) {
  grid-area: h;
  animation-delay: calc(8 * var(--stagger-delay));
}
.card:nth-child(9) {
  grid-area: i;
  animation-delay: calc(9 * var(--stagger-delay));
}
.card:nth-child(10) {
  grid-area: j;
  animation-delay: calc(10 * var(--stagger-delay));
}
.card:nth-child(11) {
  grid-area: k;
  animation-delay: calc(11 * var(--stagger-delay));
}
.card:nth-child(12) {
  grid-area: l;
  animation-delay: calc(12 * var(--stagger-delay));
}
.card:last-child {
  grid-area: 🌟;
  animation-delay: calc(13 * var(--stagger-delay));
}

```