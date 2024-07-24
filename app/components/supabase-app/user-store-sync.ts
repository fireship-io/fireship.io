import { get } from 'svelte/store';
import type { User as SupabaseUser, RealtimeChannel } from '@supabase/supabase-js';
import { userData, userProgress } from '../../stores/user'
import * as SupabaseModule from './supabase';
import { nullablePropertiesToOptional, isNotEmpty } from '../../util/helpers';
import { cloneDeep } from 'lodash';

function setUserData(data: SupabaseModule.UserDataType) {
  userData.set(nullablePropertiesToOptional(data));
}
function setProgressData(
  data: SupabaseModule.ProgressDataType | SupabaseModule.ProgressDataType[],
  mustDelete = false
) {
  const arrayData = Array.isArray(data) ? data : [data];
  if (!mustDelete)
    userProgress.update((userProgressOldVal) => arrayData.reduce(
      (oldProgressState, data) => {
        const oldXpForPointedRoute = oldProgressState.xpPerRoute[data.course_route];
        const newXpForPointedRoute = (data.xp ?? 0);
        oldProgressState.xp += newXpForPointedRoute - (oldXpForPointedRoute ?? 0);
        oldProgressState.xpPerRoute[data.course_route] = newXpForPointedRoute;
        oldProgressState.markIdToRoute[data.mark_id] = data.course_route;
        return oldProgressState;
      },
      userProgressOldVal ?? { xp: 0, markIdToRoute: {}, xpPerRoute: {} })
    );
  else
    userProgress.update((userProgressOldVal) => {
    if (userProgressOldVal === null) {
      console.error("A mark has been deleted while the user was not supposed to own any");
      return userProgressOldVal;
    }
    return arrayData.reduce(
      (oldProgressState, { mark_id: markIdToDelete }) => {
        const routeToDelete = oldProgressState.markIdToRoute[markIdToDelete];
        const xpToRemove = oldProgressState.xpPerRoute[routeToDelete];
        const newProgressState = cloneDeep(oldProgressState);
        newProgressState.xp -= xpToRemove;
        delete newProgressState.xpPerRoute[routeToDelete];
        delete newProgressState.markIdToRoute[markIdToDelete];
        return newProgressState;
      },
      userProgressOldVal
    )
  });
}

function emptyWritables() {
  userData.set(null);
  userProgress.set(null);
}
async function fetchUserDataAndSetWritables(authenticatedUser: SupabaseUser) {
  try {
    const userUid = authenticatedUser.id;
    const userProfileData = await SupabaseModule.
      fetchUserProfileData(authenticatedUser);
    setUserData(userProfileData);
    const userProgressData = await SupabaseModule.
      fetchUserProgressData(userUid);
    setProgressData(userProgressData);
  } catch(err) {
    console.error("Error in initial data fetching:\n\t" + err);
  }
}

let unsubData: SupabaseModule.CustomUnsubscriber | null = null;
let unsubProgress: SupabaseModule.CustomUnsubscriber | null = null;

function startChannels(authenticatedUser: SupabaseUser) {
  if (unsubData === null)
  unsubData = SupabaseModule.onUserProfileDataChange(authenticatedUser, (payload) => {
    const data = payload.new;
    if (isNotEmpty(data)) setUserData(data);
  });
  if (unsubProgress === null)
  unsubProgress = SupabaseModule.onUserProgressDataChange(authenticatedUser, (payload) => {
    if (payload.eventType == "DELETE")
      setProgressData(payload.old as SupabaseModule.ProgressDataType, true);
    else
      setProgressData(payload.new);
  });
}
function stopChannels() {
  unsubData && unsubData();
  unsubProgress && unsubProgress();
  unsubData = null;
  unsubProgress = null;
}

/** Initially set writables if the user is already authenticated;
 *
 * Returns a function to unsubscribe every watcher (database + auth).
 *
 * Call this function when mounting one single component in the static page,
 * e.g. the global-data component.
 *
 */
async function fetchAndWatchUserRemoteData() {
  // Perform a session refreshing, if needed.
  const authenticatedUser: SupabaseUser | null = await SupabaseModule.
    refreshUserSession();
  if (authenticatedUser) {
    startChannels(authenticatedUser);
  }
  
  const { data: { subscription: subscription } } = SupabaseModule.
  onAuthStateChange(async (_event, session) => {
    const authenticatedUser = session?.user;
    if (authenticatedUser) {
      startChannels(authenticatedUser);
      if (_event === "INITIAL_SESSION" && (
        get(userData) === null ||  get(userProgress) === null
      ))
        await fetchUserDataAndSetWritables(authenticatedUser);
    } else {
      emptyWritables();
      stopChannels();
    }
  });
  return () => { subscription.unsubscribe(); stopChannels(); };
};

export { fetchAndWatchUserRemoteData };
