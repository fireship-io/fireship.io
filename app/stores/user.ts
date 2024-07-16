import { writable, derived } from "svelte/store";
import { siteData } from "./data";
import { onAuthStateChange, onProgressChange, onUserChange } from "../util/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
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

export const userData = writable<UserData>(null as unknown as UserData);
export const userProgress = writable<UserProgress>(null as unknown as UserProgress);

let unsubData: RealtimeChannel;
let unsubProgress: RealtimeChannel;

onAuthStateChange((_, session) => {
  const sbUser = session?.user ?? null;
  if (sbUser) {
    unsubData = onUserChange(sbUser,
      ({ new: data }) => {
        if (isNotEmpty(data))
          userData.set(nullablePropertiesToOptional(data));
      }).subscribe();
    unsubProgress = onProgressChange(sbUser,
      ({ new: data }) => {
        if (isNotEmpty(data))
          userProgress.update((oldProgressState) => {
            const oldXpForPointedRoute = oldProgressState[data.course_route];
            const newXpForPointedRoute = (data.xp ?? 0);
            if (oldXpForPointedRoute) {
              oldProgressState.xp += newXpForPointedRoute - oldXpForPointedRoute;
            }
            oldProgressState[data.course_route] = newXpForPointedRoute;
            return oldProgressState;
          });
      }).subscribe();
  } else {
    unsubData && unsubData.unsubscribe();
    unsubProgress && unsubProgress.unsubscribe();
    userData.set(null as unknown as UserData);
    userProgress.set(null as unknown as UserProgress);
  }
});

export const canAccess = derived(
  [userData, siteData],
  ([$userData, $siteData]) => {
    return true;
  },
);
