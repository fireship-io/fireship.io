// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBns4UUCKIfb_3xOesTSezA9GbEyuIU7XA',
    authDomain: 'fireship-app.firebaseapp.com',
    databaseURL: 'https://fireship-app.firebaseio.com',
    projectId: 'fireship-app',
    storageBucket: 'fireship-app.appspot.com',
    messagingSenderId: '176605045081',
    appId: '1:176605045081:web:d87a63bd943e3032',
    measurementId: 'G-VTJV5CVC6K'
  },
  // stripe: 'pk_test_m3a5moXVKgThpdfwzKILvnbG'
  stripe: 'pk_live_qSaGVmF1x4X3vIWZmpbgceNU'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
