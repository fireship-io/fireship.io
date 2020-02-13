---
title: Ionic CSS Variables Dynamic Theme Generator
lastmod: 2018-08-14T15:10:28-07:00
publishdate: 2018-08-14T15:10:28-07:00
author: Jeff Delaney
draft: false
description: Build a dynamic theme generator and animation controller in Ionic 4 using CSS4 variables
tags: 
    - ionic
    - css

youtube: RVh6nngPuNw
github: https://github.com/AngularFirebase/128-ionic4-theme-generator 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

One of the major changes to theming in [Ionic 4](https://beta.ionicframework.com/docs/) is the use of [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables), which are simply CSS values that can be reused across multiple elements or components. Unlike variables in Sass or LESS that need to be compiled, they can be changed and interpreted by the browser on the fly. This is an extremely powerful feature for web components that use the Shadow DOM, like Ionic 4. 


![Demo of the Ionic 4 dynamic theme builder app](https://u5xzz.app.goo.gl/adcj)


The following lesson will teach you the basics of CSS Variables, then we show you how to create a dynamic theme generator that works across all platforms. A common use-case for variables is to build a frontend UI that allows users to switch between *light* and *dark* mode. A great real-world example is the [Dark Mode for YouTube](https://support.google.com/youtube/answer/7385323?co=GENIE.Platform%3DDesktop&hl=en). 

## CSS Variable Basics

CSS variables are really simple. The most basic usage is to define a set of global variables for common theme elements like color, border radius, shadows, etc. It is common to set global vars on the `:root` because it ensures that they will be picked up by all other elements in the DOM. 

In the example below, we define a variable named `--primary-color` as the color orange. Then we use it as the background on a button `var(--primary-color)`. 

```css
:root {
  --primary-color: orange;
}

button {
  background: var(--primary-color);
}
```

It's also smart to provide a fallback value, just in case the variable is undefined. 

```css
button {
  background: var(--primary-color, green);
}
```


Variables cascade just like regular CSS. If you override a variable, its children will inherit the new value.

```css

:root {
  --primary-color: orange;
}

article {
  background: var(--primary-color);
}

button {
  --primary-color: blue;
  background: var(--primary-color);
}
```

In the snippet above, the article will be *orange*, while the button will be *blue*. 

## How Ionic uses CSS Variables

Ionic has a large set of global CSS variables that can be used to style virtually all aspects of the application. You can find them in the `src/theme/variables.scss` file. I recommend checking out Ionic's new [Color Theme Generator](https://beta.ionicframework.com/docs/theming/color-generator) and use [Coolors.co](https://coolors.co/) if you need inspiration for a color palette. 


{{< figure src="img/ionic-color-generator.png" caption="The Ionic 4 color generator tool for CSS variables" >}}


## Building a Custom Theme Generator with Ionic 4

Our goal is to build a theme controller that makes composing unique themes as easy as possible. When we finish the service, creating a new theme is as easy as passing it a new object with 1 to 8 colors.

```shell
ionic generate service theme
```

We will be installing a utility library called [color](https://www.npmjs.com/package/color) to calculate the correct tint, shade, and contrast for our base colors. 

```shell
npm i color
```

## Pure Function for Generating a CSS String

Our goal is to send a few pass in an object of input colors, then return a CSS string that overrides the global Ionic CSS variables. The code below is quite simple - pass in an object of colors, then use them to define our CSS as a string. 

<p class="tip">You can include this code inside the `theme.service` or any other file of your choosing. I omitted most of the CSS to keep it short, but you can find the full source code on <a href="https://github.com/AngularFirebase/128-ionic4-theme-generator">github</a>.</p>

```js
import * as Color from 'color';

const defaults = {
  primary: '#3880ff',
  secondary: '#0cd1e8',
  tertiary: '#7044ff',
  success: '#10dc60',
  warning: '#ffce00',
  danger: '#f04141',
  dark: '#222428',
  medium: '#989aa2',
  light: '#f4f5f8'
};

function contrast(color, ratio = 0.8) {
  color = Color(color);
  return color.isDark() ? color.lighten(ratio) : color.darken(ratio);
}

function CSSTextGenerator(colors) {
  colors = { ...defaults, ...colors };

  const {
    primary,
    secondary,
    tertiary,
    success,
    warning,
    danger,
    dark,
    medium,
    light
  } = colors;

  const shadeRatio = 0.1;
  const tintRatio = 0.1;

  return `
    --ion-color-base: ${light};
    --ion-color-contrast: ${dark};

    --ion-color-primary: ${primary};
    --ion-color-primary-rgb: 56,128,255;
    --ion-color-primary-contrast: ${contrast(primary)};
    --ion-color-primary-contrast-rgb: 255,255,255;
    --ion-color-primary-shade:  ${Color(primary).darken(shadeRatio)};

    // omitted other styles, see full source code
`;
}
```

### Theme Generator Service

Now that we have the logic for creating a CSS theme, we just need some basics JavaScript to update it on the DOM. The service below provides a `setTheme` method to update ALL global variables, and another `setVariable` method to create/update an individual CSS variable. 

```typescript
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {}

  // Override all global variables with a new theme
  setTheme(theme) {
    const cssText = CSSTextGenerator(theme);
    this.setGlobalCSS(cssText);
  }

  // Define a single CSS variable
  setVariable(name, value) {
    this.document.documentElement.style.setProperty(name, value);
  }

  private setGlobalCSS(css: string) {
    this.document.documentElement.style.cssText = css;
  }

}
```

### Saving Themes Across Sessions with Ionic Storage

If the user refreshes the page their current theme will revert back to the default. That's not a great user experience, but we can fix it easily with the [Ionic Storage package](https://beta.ionicframework.com/docs/building/storage). 


```typescript

import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private storage: Storage
  ) {
    storage.get('theme').then(cssText => {  // <--- GET SAVED THEME
      this.setGlobalCSS(cssText);
    });
  }

  // Override all global variables with a new theme
  setTheme(theme) {
    const cssText = CSSTextGenerator(theme);
    this.setGlobalCSS(cssText);
    this.storage.set('theme', cssText); // <--- SAVE THEME HERE
  }

}
```

## Using the Theme Service in a Component

All the hard work is done. Now we just need to inject our *ThemeService* into a page or component and put it to use. 

### Change the Global Theme

In my home page, I have defined a set of themes that can be updated when the user clicks a button. 


```typescript
import { Component } from '@angular/core';
import { ThemeService } from '../theme.service';

const themes = {
  autumn: {
    primary: '#F78154',
    secondary: '#4D9078',
    tertiary: '#B4436C',
    light: '#FDE8DF',
    medium: '#FCD0A2',
    dark: '#B89876'
  },
  night: {
    primary: '#8CBA80',
    secondary: '#FCFF6C',
    tertiary: '#FE5F55',
    medium: '#BCC2C7',
    dark: '#F7F7FF',
    light: '#495867'
  },
  neon: {
    primary: '#39BFBD',
    secondary: '#4CE0B3',
    tertiary: '#FF5E79',
    light: '#F4EDF2',
    medium: '#B682A5',
    dark: '#34162A'
  }
};

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  constructor(private theme: ThemeService) {}

  changeTheme(name) {
    this.theme.setTheme(themes[name]);
  }
}
```

Now we can just bind the theme options to a few buttons:

```html
<ion-button (click)="changeTheme('autumn')">Autumn</ion-button>
<ion-button (click)="changeTheme('night')">Dark</ion-button>
<ion-button (click)="changeTheme('neon')">Neon</ion-button>
```


### Controlling CSS Animations with Variables

Another cool trick we can pull off with CSS variables is to control animation parameters. Let's setup an animation for a rotating spinner:

```css
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.spin {
    animation: spin var(--speed) linear infinite;
}
```

Then we can define another handler in our component. 

```typescript
@Component(...)
export class HomePage {

  changeSpeed(val) {
    this.theme.setVariable('--speed', `${val}ms`);
  }
}
```

And lastly, we setup a buttons so the user can change the animation rotation speed in the UI:

```html
<ion-button (click)="changeSpeed(2000)">Slow</ion-button>
<ion-button (click)="changeSpeed(500)">Fast</ion-button>
```


## The End

Hopefully this article gave you a solid understanding of CSS variables and how awesome they are as a theme building tool. The theme generator code in this lesson is not perfect, but it could easily be tweaked to fit the needs of your app. Let me know if you have any questions by leaving a comment below. 