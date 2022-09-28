---
title: How to Build a Theme-Switcher
lastmod: 2020-03-24T12:00:40-07:00
publishdate: 2020-03-24T12:00:40-07:00
author: Jeff Delaney
draft: false
description: Build a dynamic theme-switcher with CSS variables and JavaScript. 
tags: 
    - css
    - javascript

youtube: rXuHGLzSmSE
github: https://github.com/fireship-io/226-css-theme-toggler
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Almost every good dev website these days has the ability to [switch between light/dark mode](/snippets/light-dark-mode-theme-css) - but how do you toggle multiple themes and style variations? The following lesson demonstrates how to build a theme switcher, inspired by [Alligator.io](https://alligator.io), that allows a user to switch between four different global styles - light, dark, light-solar, and dark-solar. 

## Theme Switcher

### Dropdown Menu

The HTML markup should should have some type of clickable element. In this demo, we have a dropdown, where each link has a unique ID for light, dark, and solar. Checkout the [CSS dropdown menu](/snippets/basic-css-dropdown-menu) menu for a complete guide on building the menu from the video. Also notice how the `body` element starts with a class of light. 

{{< file "html" "index.html" >}}
```html
<body class="light">

    <ul class="dropdown">

        <li class="dropdown-item">
            <a id="light" href="#">light</a>
        </li>
        <li class="dropdown-item">
            <a id="dark" href="#">dark</a>
        </li>
        <li class="dropdown-item">
            <a id="solar" href="#">solarize</a>
        </li>

    </ul>

</body>
```

### CSS Themes

[CSS Variables](https://youtu.be/NtRmIp4eMjs) allow us to create reusable values that can be swapped out at runtime.

First, define all available colors on the root element.

Next, use these colors to create two mutually exclusive themes - light and dark. 
 
Last, modify (solarize) the light/dark themes by changing the base colors on the root element. The end result is a total of 4 unique color schemes. 

{{< file "css" "style.css" >}}
```css
:root {
    --gray0: #f8f8f8;
    --gray1: #dbe1e8;
    --gray2: #b2becd;
    --gray3: #6c7983;
    --gray4: #454e56;
    --gray5: #2a2e35;
    --gray6: #12181b;
    --blue: #0084a5;
    --purple: #a82dd1;
    --yellow: #fff565;
}

.light {
    --bg: var(--gray0);
    --bg-nav: linear-gradient(to right, var(--gray1), var(--gray3));
    --bg-dropdown: var(--gray0);
    --text: var(--gray6);
    --border-color: var(--blue);
    --bg-solar: var(--yellow);
}
  

.dark {
    --bg: var(--gray5);
    --bg-nav: linear-gradient(to right, var(--gray5), var(--gray6));
    --bg-dropdown: var(--gray6);
    --text: var(--gray0);
    --border-color: var(--purple);
    --bg-solar: var(--blue);
}

.solar {
    --gray0: #fbffd4;
    --gray1: #f7f8d0;
    --gray2: #b6f880;
    --gray3: #5ec72d;
    --gray4: #3ea565;
    --gray5: #005368;
    --gray6: #003d4c;
}
```

### JavaScript

The code below uses plain vanilla JS to grab the theme button elements from the DOM, then toggles CSS classes on the body. It also caches the user's selections in the [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) browser API so the site uses the same theme across sessions. 

{{< file "js" "app.js" >}}
```javascript
// DOM Elements

const darkButton = document.getElementById('dark');
const lightButton = document.getElementById('light');
const solarButton = document.getElementById('solar');
const body = document.body;


// Apply the cached theme on reload

const theme = localStorage.getItem('theme');
const isSolar = localStorage.getItem('isSolar');

if (theme) {
  body.classList.add(theme);
  isSolar && body.classList.add('solar');
}

// Button Event Handlers

darkButton.onclick = () => {
  body.classList.replace('light', 'dark');
  localStorage.setItem('theme', 'dark');
};

lightButton.onclick = () => {
  body.classList.replace('dark', 'light');

  localStorage.setItem('theme', 'light');
};

solarButton.onclick = () => {

  if (body.classList.contains('solar')) {
    
    body.classList.remove('solar');
    localStorage.removeItem('isSolar');

  } else {

    body.classList.add('solar');
    localStorage.setItem('isSolar', true);

  }
};
```