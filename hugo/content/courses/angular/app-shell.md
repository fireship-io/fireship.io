---
title: App Navigation Shell
description: Add a responsive navigation shell to the app
weight: 24
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 358714095
emoji: 🐚
video_length: 8:45
---

Add a basic navigation shell to the app and make it responsive on mobile.

## Steps

### Step 1 - Update the App Component

Nesting components inside each other is known as *transclusion*. 

{{< file "html" "app.component.html" >}}
{{< highlight html >}}
<app-shell>

    <router-outlet></router-outlet>
    
</app-shell>
{{< /highlight >}}

### Shell Breakpoint Logic

Make your navigation responsive by listening to breakpoints.

{{< file "ngts" "shell.component.ts" >}}
{{< highlight typescript >}}
import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

}
{{< /highlight >}}

### Shell HTML

Full markup for the navigation shell. 

{{< file "html" "shell.component.html" >}}
{{< highlight html >}}
<mat-sidenav-container class="sidenav-container">

  <!-- SIDENAV -->

  <mat-sidenav #drawer class="sidenav" fixedInViewport
      [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
      [mode]="(isHandset$ | async) ? 'over' : 'side'"
      [opened]="false">
    <mat-toolbar>Menu</mat-toolbar>
    <mat-nav-list>
     
      <a mat-list-item routerLink="/" (click)="drawer.close()">Home</a>
      <a mat-list-item routerLink="/login" (click)="drawer.close()">Login</a>
      <a mat-list-item routerLink="/kanban" (click)="drawer.close()">Kanban Demo</a>
      <a mat-list-item routerLink="/customers" (click)="drawer.close()">SSR Demo</a>
    </mat-nav-list>
  </mat-sidenav>
  <mat-sidenav-content>

  <!-- TOP TOOLBAR-->

    <mat-toolbar>
      <button 
        type="button"
        aria-label="Toggle sidenav"
        mat-icon-button
        (click)="drawer.toggle()"
        *ngIf="isHandset$ | async">


        <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
      </button>
      <span class="logo" routerLink="/">🔥 Angular Firestarter</span>

      <span class="fill-space"></span>
      <div *ngIf="!(isHandset$ | async)">
        <a mat-button routerLink="/kanban">🍱 Kanban Demo</a>
        <a mat-button routerLink="/customers">⚡ SSR Demo</a>

        <a mat-button routerLink="/login">🔑 Login</a>

      </div>

      <!-- DROPDOWN MENU -->

      <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Example icon-button with a menu">
        <mat-icon>more_vert</mat-icon>
      </button>
      
      <mat-menu #menu="matMenu">
        <a mat-menu-item href="https://fireship.page.link/slack">
          <i>💬</i>
          <span>Chat on Slack</span>
        </a>
      </mat-menu>
    </mat-toolbar>

    <!-- TRANSCLUSION -->
    <ng-content></ng-content>

  </mat-sidenav-content>
</mat-sidenav-container>
{{< /highlight >}}
