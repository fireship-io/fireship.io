import { Injectable, ApplicationRef } from '@angular/core';

import * as firebase from 'firebase/app';
import { auth } from 'firebase/app';
import { user } from 'rxfire/auth';
import { tap, switchMap } from 'rxjs/operators';
import { NotificationService } from '../notification/notification.service';
import { onLogout, onLogin } from '../notification/notifications';
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

  constructor(private app: ApplicationRef, private ns: NotificationService) {
    this.user$ = user(this.authClient)

    .pipe(tap(u => {
      this.user = u;
      this.app.tick();
    }));

    this.user$.subscribe();

    this.userDoc$ = this.getUserDoc$('users');
    this.userProducts$ = this.getUserDoc$('products');
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
    this.ns.setNotification(onLogout);
  }

  async login() {
    await this.authClient.signInWithPopup(new auth.GoogleAuthProvider());
    this.ns.setNotification(onLogin);
  }

  get userId() {
    return this.user ? this.user.uid : null;
  }
}
