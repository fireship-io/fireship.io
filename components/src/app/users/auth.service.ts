import { Injectable, ApplicationRef } from '@angular/core';

import * as firebase from 'firebase/app';
import { auth } from 'firebase/app';
import { user } from 'rxfire/auth';
import { tap, switchMap } from 'rxjs/operators';
import { NotificationService } from '../notification/notification.service';
import { onLogout, onLogin, onError } from '../notification/notifications';
import { docData } from 'rxfire/firestore';
import { of, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authClient = firebase.auth();

  user$: Observable<any>;
  userDoc$: Observable<any>;

  userProducts$: Observable<any>;

  user;
  userDoc;

  constructor(private app: ApplicationRef, private ns: NotificationService) {
    // Why service subsciptions? Maintain state between route changes with change detection.
    this.user$ = user(this.authClient)

    .pipe(tap(u => {
      this.user = u;
      this.app.tick();
    }));


    this.userDoc$ = this.getUserDoc$('users').pipe(tap(u => {
      this.userDoc = u;
      this.app.tick();
    }));


    this.user$.subscribe();
    this.userDoc$.subscribe();
   }

   getUserDoc$(col) {
    return user(this.authClient).pipe(
      switchMap(u => {
        return u ? docData(firebase.firestore().doc(`${col}/${(u as any).uid}`)) : of(null);
      })
    );
   }

  signOut() {
    this.authClient.signOut();
    location.replace('https://fireship.io');
    this.ns.setNotification(onLogout);
  }

  async googleLogin() {
    const credential = this.authClient.signInWithPopup(new auth.GoogleAuthProvider());
    return this.loginHandler(credential);
  }

  get userId() {
    return this.user ? this.user.uid : null;
  }


  async emailSignup(email: string, password: string) {
    const credential = this.authClient.createUserWithEmailAndPassword(email, password);
    return this.loginHandler(credential);
  }

  async emailLogin(email: string, password: string) {
    const credential = this.authClient.signInWithEmailAndPassword(email, password);
    return this.loginHandler(credential);
  }

  async resetPassword(email: string) {
    return this.authClient.sendPasswordResetEmail(email);
  }

  async loginHandler(promise) {
    let res, serverError;
    try {
      res = await promise;
      this.ns.setNotification(onLogin);
    } catch (err) {
      serverError = err.message;
      console.error(err);
      // this.ns.setNotification({ ...onError, message: serverError });
    }

    return { res, serverError };
  }
}
