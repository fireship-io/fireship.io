---
title: Lazy Loaded Login Feature
description: Configure the router for lazy-loaded user module, aka code splitting.
weight: 30
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 358915030
emoji: 🤸
chapter_start: Users
video_length: 3:54
---

Create a lazy-loaded feature module to handle user sign-in and related tasks. 

## Steps

### Step 1

Generate a feature module with routing and add a component to it. 

{{< file "terminal" "command line" >}}
```text
ng g module user --routing
ng g component user/login-page
```


### Step 2 - Update the User Routes

Add the component to the user module routes. 

{{< file "ngts" "user-routing.module.ts" >}}
```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';


const routes: Routes = [
  { path: '', component: LoginPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
```

### Step 3 - Update the Root Routes

Use a dynamic import in the root router that references the lazy user module. 

{{< file "ngts" "app-routing.module.ts" >}}
```typescript
const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'login', loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```