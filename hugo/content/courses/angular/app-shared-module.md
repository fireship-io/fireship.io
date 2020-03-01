---
title: Shared Module
description: Share component and Material Modules efficiently throughout the app
weight: 23
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 358706034
emoji: 🤝
video_length: 3:59
---

Create a shared module to avoid duplicate imports and exports of common Angular Material features. 

{{< figure src="/courses/angular/img/shared-module.png" caption="The SharedModule exports all declarations and modules so they can be consumed in other feature modules." >}}

## Steps

### Step 1 - Create a Module

{{< file "terminal" "command line" >}}
{{< highlight text >}}
ng g module shared
{{< /highlight >}}

Add it to the app module. It will be imported by all features in this app. 

{{< file "ngts" "app.module.ts" >}}
{{< highlight typescript >}}
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule // <-- here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
{{< /highlight >}}

### Step 2 - Consolidate Imports

Avoid duplication by consolidating your imports with the the spread syntax. We will be using the common material modules throughout the course. All Material modules listed below will be used in this app. 

{{< file "ngts" "shared.module.ts" >}}
{{< highlight typescript >}}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ShellComponent } from './shell/shell.component';

const components = [ShellComponent];

const modules = [
  CommonModule,
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  LayoutModule,
  MatSidenavModule,
  MatListModule,
  MatMenuModule,
  MatIconModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  RouterModule
];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [
    ...components,
    ...modules,
  ]
})
export class SharedModule {}
{{< /highlight >}}

### Step 3 - Add a Component

{{< file "terminal" "command line" >}}
{{< highlight text >}}
ng g component shared/shell --export 
{{< /highlight >}}
