---
title:  Responsive Animated Navbar with CSS
lastmod: 2020-02-29T15:04:10-07:00
publishdate: 2020-02-29T15:04:10-07:00
author: Jeff Delaney
draft: false
description: Build a Responsive Animated Icon Navbar with plain CSS
tags: 
    - css

youtube: biOMz4puGt8
github: https://github.com/fireship-io/222-responsive-icon-nav-css
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

The following lesson demonstrates how to build a *responsive*, *animated* icon navigation bar using nothing but plain CSS. This project combines a variety of modern CSS features like flexbox, media queries, transitions, and filters to build a unique experience with minimal code. 

<div class="vid vid-center">
    {{< vimeo 394685984 >}}
</div>

## Step 1 - Initial Setup

🚨 The demo contains a bunch of dummy HTML not shown below. Copy or clone it from the full [source code](https://github.com/fireship-io/222-responsive-icon-nav-css) to build the demo locally. 

### Create an index.html

We start with a typical HTML layout - just a navigation bar `<nav>` element with an unordered list `<ul>` nested inside. 

{{< file "html" "index.html" >}}
```html
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="style.css" />
  <link
    href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700&display=swap"
    rel="stylesheet"
  />
</head>

<body>
 <!-- Navbar-->
  <nav class="navbar">
    <ul class="navbar-nav">
      <li class="logo">
        <a href="#" class="nav-link">
          <span class="link-text logo-text">Fireship</span>
          <svg>...</svg>
        </a>
      </li>

    <li class="nav-item">
        <a href="#" class="nav-link">
          <span class="link-text">Cats</span>
          <svg>...</svg>
        </a>
    </li>

    <!-- More nav links here -->

    </ul>
  </nav>

   <!-- Content -->

  <main>
    <h1>CSS is Cool</h1>

  </main>
</body>
```

### Create a style.css

Start by setting some global variables resetting and overriding the body's defaults. 

{{< file "css" "style.css" >}}
```css
:root {
  font-size: 16px;
  font-family: 'Open Sans';
  --text-primary: #b6b6b6;
  --text-secondary: #ececec;
  --bg-primary: #23232e;
  --bg-secondary: #141418;
  --transition-speed: 600ms;
}

body {
  color: black;
  background-color: white;
  margin: 0;
  padding: 0;
}
```

## Step 2 - Customize the Content Scrollbar

The browser's default scrollbar looks really bad with a fixed vertical navigation bar. Let's fix that. 

{{< file "css" "style.css" >}}
```css
body::-webkit-scrollbar {
  width: 0.25rem;
}

body::-webkit-scrollbar-track {
  background: #1e1e24;
}

body::-webkit-scrollbar-thumb {
  background: #6649b8;
}
```

## Step 3 - Position the Navbar

There are several important CSS positioning concepts happening here:

1. The `.navbar` container is fixed to the left side and takes up 100% of the viewport height. 
2. The `.navbar-nav` is a [flex container](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox#An_aside_on_the_flex_model) with it's children flowing vertically as a column. 
3. Setting `margin-top: auto` on the last child forces the last icon to the very bottom. 
4. The width of the navbar is expanded on hover. 

{{< file "css" "style.css" >}}
```css
main {
  margin-left: 5rem;
  padding: 1rem;
}

.navbar {
  position: fixed;
  background-color: var(--bg-primary); 
  width: 5rem;
  height: 100vh;
  transition: width 600ms ease;
}

.navbar-nav {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.nav-item {
  width: 100%;
}

.nav-item:last-child {
  margin-top: auto;
}

.navbar:hover {
  width: 16rem;
}

```


## Step 4 - Animate the Navbar Links

Each `nav-link` is also a flex container, but flows horizontally as a row. The background and icon colors are animated using using a [filter](https://developer.mozilla.org/en-US/docs/Web/CSS/filter) to make them go from gray to their natural pink. 


{{< file "css" "style.css" >}}
```css
.nav-link {
  display: flex;
  align-items: center;
  height: 5rem;
  color: var(--text-primary);
  text-decoration: none;
  filter: grayscale(100%) opacity(0.7);
  transition: var(--transition-speed);
}

.nav-link:hover {
  filter: grayscale(0%) opacity(1);
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.link-text {
  display: none;
  margin-left: 1rem;
}

.nav-link svg {
  width: 2rem;
  min-width: 2rem;
  margin: 0 1.5rem;
}

.fa-primary {
  color: #ff7eee;
}

.fa-secondary {
  color: #df49a6;
}

.fa-primary,
.fa-secondary {
  transition: var(--transition-speed);
}
```

## Step 5 - Animate the Logo

The logo features an animated rotating arrow icon. This effect is created with a CSS [transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) to rotate the icon on hover. 

{{< file "css" "style.css" >}}
```css
.logo {
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 1rem;
  text-align: center;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.3ch;
  width: 100%;
}

.logo svg {
  transform: rotate(0deg);
  transition: var(--transition-speed);
}

.logo-text
{
  display: inline;
  position: absolute;
  left: -999px;
  transition: var(--transition-speed);
}

.navbar:hover .logo svg {
  transform: rotate(-180deg);
}
```


## Step 6 - Make the Navbar Responsive

Our final challenge is to make the navbar switch to a fixed bottom bar on smaller screens. Mutually-exclusive media queries are used apply styles based on the screen width. Notice how little code is needed to reposition the navbar for small screens - the power of flexbox is its ability to transform columns to rows, or vice-versa. 

```css
/* Small screens */
@media only screen and (max-width: 600px) {
  .navbar {
    bottom: 0;
    width: 100vw;
    height: 5rem;
  }

  .logo {
    display: none;
  }

  .navbar-nav {
    flex-direction: row;
  }

  .nav-link {
    justify-content: center;
  }

  main {
    margin: 0;
  }
}

/* Large screens */
@media only screen and (min-width: 600px) {
  .navbar {
    top: 0;
    width: 5rem;
    height: 100vh;
  }


  .navbar:hover .link-text {
    display: inline;
  }

  .navbar:hover .logo svg
  {
    margin-left: 11rem;
  }

  .navbar:hover .logo-text
  {
    left: 0px;
  }
}
```

## Go Further

You may have noticed how the navbar can cycle through themes - learn how to [dynamically theme your website](/snippets/light-dark-mode-theme-css) with a little bit of JS. 
