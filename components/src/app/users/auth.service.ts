import { Injectable, ApplicationRef } from '@angular/core';

import * as firebase from 'firebase/app';
import { auth } from 'firebase/app';
import { user } from 'rxfire/auth';
import { tap } from 'rxjs/operators';
import { NotificationService } from '../notification/notification.service';
import { onLogout, onLogin } from '../notification/notifications';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authClient = firebase.auth();

  user$;
  user;

  constructor(private app: ApplicationRef, private ns: NotificationService) {
    this.user$ = user(this.authClient)

    .pipe(tap(u => {
      this.user = u;
      this.app.tick();
    }));

    this.user$.subscribe();
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
