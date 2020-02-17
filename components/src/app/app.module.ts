import { BrowserModule,  } from '@angular/platform-browser';
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LOCAL_STORAGE_PROVIDERS } from './local-storage.service';
import { createCustomElement } from '@angular/elements';

import { GoogleLoginComponent } from './users/google-login/google-login.component';
import { ThemeBtnComponent } from './theme-btn/theme-btn.component';
import { RouteLoaderComponent } from './route-loader/route-loader.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { LazyComponent } from './lazy/lazy.component';
import { AlgoliaSearchComponent } from './algolia/algolia-search/algolia-search.component';
import { ModalButtonComponent } from './modal-button/modal-button.component';
import { SlackMirrorComponent } from './slack-mirror/slack-mirror.component';
import { TogglerComponent } from './toggler/toggler.component';
import { NotificationComponent } from './notification/notification.component';
import { PaymentFormComponent } from './access/payment-form/payment-form.component';
import { ProductSelectComponent } from './access/product-select/product-select.component';
import { UserChargesComponent } from './access/user-charges/user-charges.component';
import { UsdPipe } from './access/usd.pipe';
import { UserDataComponent } from './user-data/user-data.component';
import { UserSourcesComponent } from './access//user-sources/user-sources.component';
import { SubscriptionManageComponent } from './access/subscription-manage/subscription-manage.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { AllowIfComponent } from './access/allow-if/allow-if.component';
import { EmailLoginComponent } from './users/email-login/email-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginModalComponent } from './users/login-modal/login-modal.component';
import { CarbonAdsComponent } from './access/ads/carbon-ads.component';

const comps = [
  GoogleLoginComponent,
  ThemeBtnComponent,
  RouteLoaderComponent,
  UserProfileComponent,
  LazyComponent,
  AlgoliaSearchComponent,
  ModalButtonComponent,
  LoginModalComponent,
  SlackMirrorComponent,
  TogglerComponent,
  NotificationComponent,
  PaymentFormComponent,
  ProductSelectComponent,
  UserChargesComponent,
  UserDataComponent,
  UserSourcesComponent,
  SubscriptionManageComponent,
  SpinnerComponent,
  AllowIfComponent,
  EmailLoginComponent,
  CarbonAdsComponent
];

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  declarations: [
    ...comps,
    UsdPipe
  ],
  entryComponents: comps,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [LOCAL_STORAGE_PROVIDERS]
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
      [ModalButtonComponent, 'modal-button'],
      [LoginModalComponent, 'login-modal'],
      [SlackMirrorComponent, 'slack-mirror'],
      [TogglerComponent, 'menu-toggler'],
      [NotificationComponent, 'app-notification'],
      [PaymentFormComponent, 'payment-form'],
      [ProductSelectComponent, 'product-select'],
      [UserChargesComponent, 'user-charges'],
      [UserDataComponent, 'user-data'],
      [UserSourcesComponent, 'user-sources'],
      [SubscriptionManageComponent, 'subscription-manage'],
      [SpinnerComponent, 'loading-spinner'],
      [AllowIfComponent, 'allow-if'],
      [EmailLoginComponent, 'email-login'],
      [CarbonAdsComponent, 'carbon-ads']
    ];

    for (const [component, name] of elements) {
      const el = createCustomElement(component, { injector: this.injector });
      customElements.define(name, el);
    }
  }
}
