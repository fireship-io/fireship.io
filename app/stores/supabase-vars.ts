/** These stores are here just for components to
 * emit events for the supabase-component.
 */

import { writable, type Writable, type Unsubscriber } from "svelte/store";

type Provider = 'github' | 'eirbconnect';

export interface MarkData {
  isComplete: boolean,
  route: string;
  bonus?: number
};

const _signIn = writable<Provider | false | null>(null);
const _deleteUserData = writable<boolean | null>(null);
const _markCourse = writable<MarkData | null>(null);

// For components which want to interact with Supabase

type AfterEventCallback = (() => Promise<void>) | (() => void);

/** Executes the callback when the supabase-component has triggered
 * the processOver flag, i.e. it has finished to process the current event.
 */
const whenProcessOver = <T>(w: Writable<T|null>, callback: AfterEventCallback) => {
  let sb: Unsubscriber | null = null;
  sb = w.subscribe((val) => { if (val === null) { if (sb) sb(); callback(); } });
}

function signInWith(provider: Provider, whenDone?: AfterEventCallback) {
  if (whenDone) whenProcessOver(_signIn, whenDone);
  _signIn.set(provider);
}
function signOut(whenDone?: AfterEventCallback) {
  if (whenDone) whenProcessOver(_signIn, whenDone);
  _signIn.set(false);
};

function deleteUserData(whenDone?: AfterEventCallback) {
  if (whenDone) whenProcessOver(_deleteUserData, whenDone);
  _deleteUserData.set(true);
}

function markCourse(markData: {route: string, bonus?: number},
  whenDone?: AfterEventCallback) {
  if (whenDone) whenProcessOver(_markCourse, whenDone);
  _markCourse.set({ ...markData, isComplete: true });
}
function unMarkCourse(route: string, whenDone?: AfterEventCallback) {
  if (whenDone) whenProcessOver(_markCourse, whenDone);
  _markCourse.set({ route, isComplete: false });
}

// For the supabase-app components


/** If the provided condition is checked, trigger the callback and then reset
 * the writable to the neutral initial value
 */
function fireCallback<TrueSet, FalseSet>(
  w: Writable<TrueSet | FalseSet | null>, 
  callback: ((val: TrueSet) => Promise<void>) | (() => Promise<void>),
  indicatorFunction: (val: TrueSet | FalseSet) => TrueSet | null,
) {
  return w.subscribe(async (val) => {
    if (val === null) return;
    const correctValue = indicatorFunction(val); 
    if (correctValue === null) return;
    await callback(correctValue);
    w.set(null);
  });
}

const onSignIn = (callback: (provider: Provider) => Promise<void>) =>
  fireCallback(_signIn, callback, v => v ? v : null);
const onSignOut = (callback: () => Promise<void>) => fireCallback(_signIn, callback, (v) => v ? null: v);

const onUserDataDelete = (callback: () => Promise<void>) => fireCallback(_deleteUserData, callback, v => v);

const onCourseMarked = (callback: (val: MarkData) => Promise<void>) => fireCallback(_markCourse, callback, v => v.isComplete ? v : null);

const onCourseUnmarked = (callback: (val: MarkData) => Promise<void>) => fireCallback(_markCourse, callback, v => v.isComplete ? null : v);

export const supabaseSide = { 
  onSignIn, onSignOut, onUserDataDelete, onCourseMarked, onCourseUnmarked
}
export const componentsSide = {
  signInWith, signOut, deleteUserData, markCourse, unMarkCourse
}
