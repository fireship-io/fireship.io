import { get } from 'svelte/store';
import type { User as SupabaseUser, RealtimeChannel } from '@supabase/supabase-js';
import { userData, userProgress } from '../../stores/user'
import * as SupabaseModule from '../../util/supabase';
import { nullablePropertiesToOptional, isNotEmpty } from '../../util/helpers';

function setUserData(data: SupabaseModule.UserDataType) {
  userData.set(nullablePropertiesToOptional(data));
}
function setProgressData(
  data: SupabaseModule.ProgressDataType | SupabaseModule.ProgressDataType[]
) {
  const arrayData = Array.isArray(data) ? data : [data];
  userProgress.update((userProgressOldVal) => arrayData.reduce(
    (oldProgressState, data) => {
      const oldXpForPointedRoute = oldProgressState[data.course_route];
      const newXpForPointedRoute = (data.xp ?? 0);
      if (oldXpForPointedRoute) {
        oldProgressState.xp += newXpForPointedRoute - oldXpForPointedRoute;
      }
      oldProgressState[data.course_route] = newXpForPointedRoute;
      return oldProgressState;
    },
    userProgressOldVal ?? { xp: 0 })
  );
}

function emptyWritables() {
  userData.set(null);
  userProgress.set(null);
}
async function fetchAndSetWritables(authenticatedUser: SupabaseUser) {
  const userUid = authenticatedUser.id
  const userProfileData = await SupabaseModule.fetchUserData(userUid);
  if (!userProfileData) throw new Error("The user must have a profile data");
  setUserData(userProfileData);
  const userProgressData = await SupabaseModule.fetchUserProgressData(userUid)
  if (!userProgressData) {
    console.error("Unable to fetch user's progress data");
    return;
  };
  setProgressData(userProgressData);
}

let unsubData: RealtimeChannel;
let unsubProgress: RealtimeChannel;

function startChannels(authenticatedUser: SupabaseUser) {
  unsubData = SupabaseModule.onUserChange(authenticatedUser, (payload) => {
    const data = payload.new;
    if (isNotEmpty(data)) setUserData(data);
  });
  unsubProgress = SupabaseModule.onProgressChange(authenticatedUser, (payload) => {
    const data = payload.new;
    if (isNotEmpty(data)) setProgressData(data);
  });
}
function stopChannels() {
  unsubData && unsubData.unsubscribe();
  unsubProgress && unsubProgress.unsubscribe();
}

/** Initially set writables if the user is already authenticated;
 *
 * Call this function when mounting one single component in the static page,
 * e.g. the global-data component.
 *
 */
async function fetchAndWatchUserRemoteData() {
  if (!get(userData) || !get(userProgress)) {
    const authenticatedUser: SupabaseUser | null = await SupabaseModule.getUser();
    if (authenticatedUser) {
      await fetchAndSetWritables(authenticatedUser);
      startChannels(authenticatedUser);
    }
  }
  SupabaseModule.onAuthStateChange(async (_event, session) => {
    const authenticatedUser = session?.user;
    if (authenticatedUser) {
      await fetchAndSetWritables(authenticatedUser);
      startChannels(authenticatedUser);
    } else {
      emptyWritables();
      stopChannels();
    }
  });
};

export { fetchAndWatchUserRemoteData };
