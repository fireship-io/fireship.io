---
title: "Desktop Apps with Electron and Angular"
lastmod: 2017-09-21T06:56:25-07:00
publishdate: 2017-09-21T06:56:25-07:00
author: Jeff Delaney
draft: false
description: Learn how to build native desktop apps for Windows, macOS, or Linux using Angular and Electron
tags: 
    - electron
    - angular

youtube: u_vMChpZMCk
github: https://github.com/AngularFirebase/angular-electron
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

In this lesson, you will learn how to build native desktop apps with Angular and [Electron](https://electron.atom.io/). You might be surprised how easy it is to start building high-quality desktop apps for any platform, or even port your existing Angular app to native desktop platforms.

This lesson covers the following topics:

1. Configure Electron 1.7 with Angular. 
2. Build a simple timer app in Angular. 
3. Package the app for install on Windows 10, macOS, and Linux Ubuntu. 

{{< figure src="img/electron-angular-macos.gif" caption="Angular Electron app running on MacOS" >}}

## Initial Setup

Let's kick things off by building a new angular app from scratch. 

### Generate the Angular App

Generate a default app with the Angular CLI. 

```shell
npm install -g @angular/cli
ng new angular-electron
cd angular-electron
```

### Update index.html  

The generated root page in Angular points the base href to `/` - this will cause problems with Electron later on, so let's update it now. Just add a period in front of the slash in `src/index.html`. 

```html
<base href="./">
```

### Install Electron

You can install Electron in the Angular development environment. 

```shell
npm install electron --save-dev
```

## Configure Electron

The next step is to configure Electron. There are all sorts of possibilities for customization and we're just scratching the surface. 

### main.js

Create a new file named `main.js` in the root of your project - this is the Electron NodeJS backend. This is the entry point for Electron and defines how our desktop app will react to various events performed via the desktop operating system.

The `createWindow` function defines the properties of the program window that the user will see. There are many more [window options](https://github.com/electron/electron/blob/master/docs/api/browser-window.md#class-browserwindow) that facilitate additional customization, child windows, modals, etc.

Notice we are loading the window by pointing it to the `index.html` file in the `dist/` folder. Do NOT confuse this with the index file in the `src/` folder. At this point, this file does not exist, but it will be created automatically in the next step by running `ng build --prod`

```js
const { app, BrowserWindow } = require('electron')

let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 600, 
    height: 600,
    backgroundColor: '#ffffff',
    icon: `file://${__dirname}/dist/assets/logo.png`
  })


  win.loadURL(`file://${__dirname}/dist/index.html`)

  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })
}

// Create window on electron initialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})
```

That's it for the Electron setup, all the desktop app magic happens under the hood. 

## Custom Build Command

The deployed desktop app will be an [Angular AOT build](https://angular.io/guide/aot-compiler) - this happens by default when you run `ng build --prod`. It's useful to have a command that will run an AOT production build and start Electron at the same time. This can be easily configured in the package.json file. 

### package.json

```js
{
  "name": "angular-electron",
  "version": "0.0.0",
  "license": "MIT",
  "main": "main.js", // <-- update here
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e",
    "electron": "electron .", // <-- run electron 
    "electron-build": "ng build --prod && electron ." // <-- build app, then run electron 
  },
  // ...omitted
}
```

### Run the command

You can run your angular app as an native desktop app with the following command. 

```
npm run electron-build
```

At this point, you can run the command (it will take a few seconds) and it will create the `dist/` folder and will automatically bring up a window on your operating system with default Angular app. 


<p class="tip">This setup does not support hot code reloads. Whenever you change some Angular code, you need to rerun the electron-build command. It is possible to setup hot reloads by pointing the window to a remote URL (such as https://localhost:4200) and running `ng serve` in a separate terminal. </p>

## Building the Angular App

Now we need to build an Angular App that's worthy of being installed.  I am building a single page timer that will animate a progress circle, then make a chime sound when complete. 

{{< figure src="img/angular-electron-timer.gif" caption="Example app built with Angular and Electron" >}}


To keep things super simple, I am writing all the code in the app.component

### Install Round Progress Bar

To get the progress timer looking good quickly, I installed the [angular-svg-round-progressbar](https://github.com/crisbeto/angular-svg-round-progressbar) package. It gives us a pre-built component that we can animate based on the current state of the timer. 

```shell
npm install angular-svg-round-progressbar --save
```

Then add it to the `app.module.ts` (also add the FormsModule).

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms'; // <-- here
import { RoundProgressModule } from 'angular-svg-round-progressbar'; // <-- here

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, 
    FormsModule, // <-- here
    RoundProgressModule // <-- and here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### app.component.ts

The app works by allowing the user to set the number of seconds the timer will run `max`. The timer progresses by running an RxJS Observable interval every 10th of a second and incrementing the `current` value.

I also defined several getters help deal with NaN values that can cause errors in the progress circle. They also help keep the HTML logic clean and readable. 

```typescript
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/do';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  max     = 1;
  current = 0;

  /// Start the timer
  start() {
    const interval = Observable.interval(100);
    
        interval
          .takeWhile(_ => !this.isFinished )
          .do(i => this.current += 0.1)
          .subscribe();
  }

   /// finish timer
  finish() {
    this.current = this.max;
  }

  /// reset timer
  reset() {
    this.current = 0;
  }

  /// Getters to prevent NaN errors

  get maxVal() {
    return isNaN(this.max) || this.max < 0.1 ? 0.1 : this.max;
  }

  get currentVal() {
    return isNaN(this.current) || this.current < 0 ? 0 : this.current;
  }

  get isFinished() {
    return this.currentVal >= this.maxVal;
  }

}
```

### app.component.html

In the HTML, we can declare the progress component and display the user interface elements conditionally based on the state of the timer. 

```html
<main class="content">
        
    <h1>Electron Timer</h1>

    <div class="progress-wrapper" *ngIf="maxVal">

        <div class="text" *ngIf="!isFinished">
          {{ max - current | number: '1.1-1' }}
        </div>
        
        <div class="text" *ngIf="isFinished">
            ding!
            <audio src="assets/chime.mp3" autoplay></audio>
        </div>
        
        <round-progress
                [max]="max"
                [current]="current"
                [radius]="100"
                [stroke]="25">
        </round-progress>
        
    </div>

    <div class="controls-wrapper">
 
        <label>Seconds</label>
        <input class="input" placeholder="number of seconds" type="text" 
              [(ngModel)]="max"
              (keydown)="reset()">

            
        <button *ngIf="currentVal <= 0" (click)="start()">Start</button>
        <button *ngIf="!isFinished" (click)="finish()">Finish</button>
    </div>


</main>

```

## Packaging for Desktop Operating Systems

Now that we have a decent app ready for desktops, we need to package and distribute it. The [electron packager](https://github.com/electron-userland/electron-packager) tool will allow to package our code into an executable for desktop platforms - including Windows (win32), MacOS (darwin), and Linux. Keep in mind, there are several other [electron packaging tools](https://electron.atom.io/docs/tutorial/application-distribution/#packaging-tools) that might better fit your needs. 

```shell
npm install electron-packager -g
npm install electron-packager --save-dev
```

<p class="tip">Linux and MacOS developers will need to install [WineHQ](https://www.winehq.org/) if they plan on building desktop apps for Windows.</p>

In this example, I am going to build an executable for Windows. 

```shell
electron-packager . --platform=win32
```

This will generate a directory `/angular-electron-win32-x64/` that contains the executable file. 

And why not build one for MacOS while we're at it. 

```shell
electron-packager . --platform=darwin
```

This will generate a directory `/angular-electron-darwin-x64/` that contains the app.  Zip it and extract it on a mac system and you should be able to run it natively. You will get warnings that it's from an *unknown developer*, but this is expected and it's perfectly safe to open - it's your own code after all. 
