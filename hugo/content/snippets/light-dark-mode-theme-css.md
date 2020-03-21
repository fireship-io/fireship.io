---
title: Theme your Web App with CSS Variables
lastmod: 2020-02-29T15:05:40-07:00
publishdate: 2020-02-29T15:05:40-07:00
author: Jeff Delaney
draft: false
description: How to dynamically theme a website with CSS. Methods for light/dark mode and multiple custom themes.
tags: 
    - css
    - javascript

# youtube: 
github: https://github.com/fireship-io/222-responsive-icon-nav-css/blob/master/public/theme.js
type: lessons
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

If you're building websites in 2020 you MUST add an option to toggle light 🌞 dark 🌑 mode - at the very least. You can really impress your users by adding a button to toggle multiple themes. That might sound complicated, but user-controlled themes are actually very easy to implement in sites the utilize [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties). The snippet below demonstrates multiple methods for theming a website dynamically at runtime.

## Option 1 - Media Query prefers-color-scheme

> How do you get a user's preferred color scheme with CSS? 

As of 2020, it is possible in most browsers to run a media query for the user's [preferred color scheme](https://caniuse.com/#feat=prefers-color-scheme) at the system level. If their macbook is set to dark mode, then your app can automatically run with a dark theme. In the code below, we change CSS variables at the root of the application based on the result of the media query. 

### Light/Dark CSS

{{< file "css" "style.css" >}}
```css
@media (prefers-color-scheme: dark) {
    :root {
        --text-color: #b6b6b6;
        --background: #ececec;
    }
}

@media (prefers-color-scheme: light) {
    :root {
        --text-color: #1f1f1f;
        --background: #000000;
    }
}

body {
    color: var(--text-color);
    background: var(--background);
}
```


## Option 2 - Toggle CSS Variables

> How do you toggle multiple themes with CSS variables? 

The Media Query above is great for light/dark mode, but does not help sites with multiple custom themes. To handle that feature, we will need a little bit of JavaScript. Notice how the demo below allows the user to cycle between multiple themes by clicking a button.

<div class="vid vid-center">
    {{< vimeo 394685976 >}}
</div>

### Multiple CSS Themes

First, define a set of theme values and use them throughout your CSS code. 

{{< file "css" "style.css" >}}
```css
.dark {
  --text-color: #b6b6b6;
  --background: #ececec;
}

.light {
  --text-color: #1f1f1f;
  --background: #000000;
}

.solar {
  --text-color: #576e75;
  --background: #fdf6e3;
}

body {
    color: var(--text-color);
    background: var(--background);
}
```

In this example, the theme is attached to the `<body>`, but feel free to use it on any element that is theme-able. 

{{< file "html" "index.html" >}}
```html
<body class="dark"></body>
```

### JavaScript Theme Toggle

The code below provides map that creates a circular list, so the user can toggle themes in an infinite loop by clicking one button. The user's preferred theme is stored in the browser's [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) - this allows it to remain active between browser refreshes or visits from other windows. 

{{< file "js" "app.js" >}}
```javascript
// Define which theme should load next
const themeMap = {
  dark: 'light',
  light: 'solar',
  solar: 'dark'
};

// Load the existing theme in local storage
const theme = localStorage.getItem('theme');
const bodyClass = document.body.classList;
theme && bodyClass.add(theme);

// Change the theme on a button click
function toggleTheme() {
  const current = localStorage.getItem('theme');
  const next = themeMap[current];

  bodyClass.replace(current, next);
  localStorage.setItem('theme', next);
}

document.getElementById('themeButton').onclick = toggleTheme;
```