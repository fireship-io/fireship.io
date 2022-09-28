const config = {
  apiKey: "AIzaSyBns4UUCKIfb_3xOesTSezA9GbEyuIU7XA",
  authDomain: "fireship-app.firebaseapp.com",
  databaseURL: "https://fireship-app.firebaseio.com",
  projectId: "fireship-app",
  storageBucket: "fireship-app.appspot.com",
  messagingSenderId: "176605045081",
  appId: "1:176605045081:web:d87a63bd943e3032",
  measurementId: "G-VTJV5CVC6K"
};

import { toast } from '../stores/toast';
import { modal } from '../stores/modal';
import { rootURL } from '../stores/data';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  isSignInWithEmailLink,
  OAuthProvider,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';
import { initializeAnalytics, logEvent } from 'firebase/analytics';
const firebaseApp = initializeApp(config);
export const auth = getAuth(firebaseApp);

export const anal = initializeAnalytics(firebaseApp);

export function GAPageView() {
  logEvent(anal, 'page_view', {
    page_location: window.location.href,
  });
}

export function GAEvent(name: string, data?: any) {
  logEvent(anal, name, data);
}

export async function signInWithGoogle() {
  const credential = signInWithPopup(auth, new GoogleAuthProvider());
  return loginHandler(credential);
}

export async function signInWithApple() {
  const provider = new OAuthProvider('apple.com');
  const credential = signInWithPopup(auth, provider);
  return loginHandler(credential);
}

// TODO update url in production
export async function sendPasswordlessEmail(email: string, url?: string) {
  const actionCodeSettings = {
    // url: 'https://fireship.io/dashboard',
    url: url ?? `${rootURL}/dashboard`, // TODO
    // This must be true.
    handleCodeInApp: true,
  };

  let res: any, serverError: string;
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
    res = `Magic signin link sent to ${email}`;
  } catch (error) {
    serverError = error.message;
  }

  return { res, serverError };
}
export async function passwordlessSignin() {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      email = window.prompt('Please provide your email for confirmation');
    }

    const credential = signInWithEmailLink(auth, email, window.location.href);
    window.localStorage.removeItem('emailForSignIn');
    return loginHandler(credential);
  } else {
    return { res: null, serverError: 'Invalid link' };
  }
}

export async function firebaseSignOut() {
  await signOut(auth);
  toast.set({
    icon: '👋',
    message: 'Thanks for hanging out, see ya around!',
  });
}

async function loginHandler(promise: Promise<UserCredential>) {
  let res: any, serverError: string;
  try {
    res = await promise;
    modal.set(null);
    toast.set({
      message: 'Access granted! Logged into the mainframe!',
      type: 'success',
    });
  } catch (err) {
    serverError = err.message;
    console.error(err);
    toast.set({
      message: serverError,
      type: 'error',
    });
  }
  return { res, serverError };
}

// Callable Functions

interface UserAPIData {
  fn: string;
  payload: any;
}

export async function callUserAPI<T>(data: UserAPIData): Promise<T> {
  try {
    if (!auth.currentUser) {
      modal.set('signin');
      toast.set({ message: 'You must be signed in first', type: 'info' });
      return;
    }
    const { getFunctions, httpsCallable } = await import('firebase/functions');
    const functions = getFunctions();
    // connectFunctionsEmulator(functions, 'localhost', 5001); // DEV only

    const res = await httpsCallable(functions, 'userAPI')(data);
    return res.data as T;
  } catch (error) {
    console.log(error);
    toast.set({ message: error?.message ?? 'Unknown Error. Contact hello@fireship.io for help', type: 'error' });
  }
}

// Progress Tracking

export async function markComplete(route: string, bonus = 0) {
  const user = auth.currentUser;

  if (!user) {
    toast.set({ message: 'You must be logged in to track progress', type: 'error' });
    return;
  }

  const { doc, setDoc, getFirestore } = await import('firebase/firestore');
  const firestore = getFirestore();

  const userRef = doc(firestore, `progress/${user.uid}`);
  setDoc(
    userRef,
    {
      [route]: 100 + bonus,
    },
    { merge: true }
  );
}

export async function markIncomplete(route: string) {
  const user = auth.currentUser;

  const { doc, setDoc, deleteField, getFirestore } = await import('firebase/firestore');
  const firestore = getFirestore();


  const userRef = doc(firestore, `progress/${user.uid}`);
  setDoc(
    userRef,
    {
      [route]: deleteField(),
    },
    { merge: true }
  );
}
