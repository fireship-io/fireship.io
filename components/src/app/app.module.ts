import { BrowserModule,  } from '@angular/platform-browser';
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { GoogleLoginComponent } from './users/google-login/google-login.component';
import { ThemeBtnComponent } from './theme-btn/theme-btn.component';
import { RouteLoaderComponent } from './route-loader/route-loader.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { LazyComponent } from './lazy/lazy.component';
import { AlgoliaSearchComponent } from './algolia/algolia-search/algolia-search.component';
import { AlgoliaButtonComponent } from './algolia/algolia-button/algolia-button.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { SlackMirrorComponent } from './slack-mirror/slack-mirror.component';
import { TogglerComponent } from './toggler/toggler.component';
import { NotificationComponent } from './notification/notification.component';

const comps = [
  GoogleLoginComponent,
  ThemeBtnComponent,
  RouteLoaderComponent,
  UserProfileComponent,
  LazyComponent,
  AlgoliaSearchComponent,
  AlgoliaButtonComponent,
  VideoPlayerComponent,
  SlackMirrorComponent,
  TogglerComponent,
  NotificationComponent
];

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: comps,
  entryComponents: comps,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const elements: any[] = [
      [GoogleLoginComponent, 'google-login'],
      [ThemeBtnComponent, 'theme-btn'],
      [LazyComponent, 'lazy-content'],
      [RouteLoaderComponent, 'route-loader'],
      [UserProfileComponent, 'user-profile'],
      [AlgoliaSearchComponent, 'algolia-search'],
      [AlgoliaButtonComponent, 'algolia-button'],
      [VideoPlayerComponent, 'video-player'],
      [SlackMirrorComponent, 'slack-mirror'],
      [TogglerComponent, 'menu-toggler'],
      [NotificationComponent, 'app-notification']
    ];

    for (const [component, name] of elements) {
      const el = createCustomElement(component, { injector: this.injector });
      customElements.define(name, el);
    }
  }
}
