import { Injectable, ApplicationRef } from '@angular/core';

import {
  getAuth,
  signOut,
  OAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { getAnalytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { getFirestore, doc } from 'firebase/firestore';

import { user } from 'rxfire/auth';
import { tap, switchMap } from 'rxjs/operators';
import { NotificationService } from '../notification/notification.service';
import { onLogout, onLogin, onError } from '../notification/notifications';
import { docData } from 'rxfire/firestore';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = getAuth();
  analytics = getAnalytics();
  firestore = getFirestore();

  user$: Observable<any>;
  userDoc$: Observable<any>;

  userProducts$: Observable<any>;

  user;
  userDoc;

  constructor(private app: ApplicationRef, private ns: NotificationService) {
    // Why service subsciptions? Maintain state between route changes with change detection.
    this.user$ = user(this.auth).pipe(
      tap((u) => {
        this.user = u;
        this.app.tick();
        if (u) {
          // this.analytics.setUserId(u.uid);
          setUserId(this.analytics, u.uid);
        }
      })
    );

    this.userDoc$ = this.getUserDoc$('users').pipe(
      tap((u) => {
        this.userDoc = u;
        this.app.tick();
        if (u) {
          setUserProperties(this.analytics, { pro_status: u.pro_status });
        }
      })
    );

    this.user$.subscribe();
    this.userDoc$.subscribe();
  }

  getUserDoc$(col) {
    return user(this.auth).pipe(
      switchMap((u) => {
        if (u) {
          return docData(doc(this.firestore, `${col}/${(u as any).uid}`));
        } else {
          return of(null);
        }
      })
    );
  }

  signOut() {
    signOut(this.auth);
    location.replace('https://fireship.io');
    this.ns.setNotification(onLogout);
    logEvent(this.analytics, 'logout', {});
  }

  async googleLogin() {
    const credential = signInWithPopup(this.auth, new GoogleAuthProvider());
    return this.loginHandler(credential);
  }

  async appleLogin() {
    const provider = new OAuthProvider('apple.com');
    const credential = signInWithPopup(this.auth, provider);
    return this.loginHandler(credential);
  }

  get userId() {
    return this.user ? this.user.uid : null;
  }

  async emailSignup(email: string, password: string) {
    const credential = createUserWithEmailAndPassword(this.auth, email, password);
    return this.loginHandler(credential);
  }

  async emailLogin(email: string, password: string) {
    const credential = signInWithEmailAndPassword(this.auth, email, password);
    return this.loginHandler(credential);
  }

  async resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  async loginHandler(promise) {
    let res, serverError;
    try {
      res = await promise;
      this.ns.setNotification(onLogin);
      logEvent(this.analytics, 'login', {});
    } catch (err) {
      serverError = err.message;
      console.error(err);
    }

    return { res, serverError };
  }
}
