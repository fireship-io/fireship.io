---
title: Meet Angular Material
description: Introduction to Angular Material and design systems
weight: 21
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 358702411
emoji: 🎨
video_length: 5:21
---

We're ready to start building the app! It's ideal to kick off any new project with a solid foundation for design. An app that looks good from the day one will keep you happy and motivated throughout the development process. 

## Steps

### Step 1 - Install Angular Material

- Install [Angular Material](https://material.angular.io/)

{{< file "terminal" "command line" >}}
```text
ng add @angular/material
```

### Step 2 - Customize your Theme Colors (Optional)

- [Customize your Theme](https://material.angular.io/guide/theming)
- Generate a [Color Pallette](http://mcg.mbitson.com/#!?mcgpalette0=%233f51b5)



Example of a custom color pallette. 

{{< file "scss" "styles.scss" >}}
```scss
$custom-orange: (
    50: #fff3e0,
    100: #ffe0b2,
    200: #ffcc80,
    300: #ffb74d,
    400: #ffa726,
    500: #ff9800,
    600: #fb8c00,
    700: #f57c00,
    800: #ef6c00,
    900: #e65100,
    A100: #ffd180,
    A200: #ffab40,
    A400: #ff9100,
    A700: #ff6d00,
    contrast: (
        50: $black-87-opacity,
        100: $black-87-opacity,
        200: $black-87-opacity,
        300: $black-87-opacity,
        400: $black-87-opacity,
        500: white,
        600: white,
        700: white,
        800: white,
        900: white,
        A100: $black-87-opacity,
        A200: $black-87-opacity,
        A400: $black-87-opacity,
        A700: white,
    )
);
$firestarter-demo-primary: mat-palette($custom-orange);
```


### Bonus Video

<div class="vid-center">
{{< youtube Ppl64MY6FFc >}}
</div>