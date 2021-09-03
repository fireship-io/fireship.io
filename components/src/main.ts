import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

import { initializeApp } from 'firebase/app';
const app = initializeApp(environment.firebase);

import { initializeAnalytics } from 'firebase/analytics';
initializeAnalytics(app)

// import * as firebase from 'firebase/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
// import 'firebase/compat/functions';
// import 'firebase/compat/performance';
// import 'firebase/compat/analytics';
// firebase.initializeApp(environment.firebase);
// firebase.performance();



platformBrowserDynamic().bootstrapModule(AppModule, { ngZone: 'noop'})
  .catch(err => console.error(err));
