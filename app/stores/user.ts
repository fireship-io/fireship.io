import { writable, derived } from "svelte/store";
import { siteData } from "./data";
import * as SupabaseModule from "../util/supabase";
import type { RealtimeChannel, User as SupabaseUser } from "@supabase/supabase-js";
import { isNotEmpty, nullablePropertiesToOptional } from "../util/helpers";

export interface UserData {
  email?: string;
  uid?: string;
  displayName?: string;
  photoURL?: string;
  discordId?: string;
}

interface UserProgress {
  xp: number;
  [key: string]: number;
}

export const userData = writable<UserData | null>(null);
export const userProgress = writable<UserProgress | null>(null);

function setUserData(data: SupabaseModule.UserDataType) {
  console.log(JSON.stringify(nullablePropertiesToOptional(data)));
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

// initially set writables if the user is already authenticated;
(async () => {
  const authenticatedUser: SupabaseUser | null = await SupabaseModule.getUser();
  if (authenticatedUser) {
    fetchAndSetWritables(authenticatedUser);
    startChannels(authenticatedUser);
  }
})();


SupabaseModule.onAuthStateChange((_event, session) => {
  const authenticatedUser = session?.user;
  if (authenticatedUser) {
    fetchAndSetWritables(authenticatedUser);
    startChannels(authenticatedUser);
  } else {
    emptyWritables();
    stopChannels();
  }
});

export const canAccess = derived(
  [userData, siteData],
  ([$userData, $siteData]) => {
    return true;
  },
);
