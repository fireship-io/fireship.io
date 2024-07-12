import { writable, derived } from "svelte/store";
import { GASetUser } from "../util/firebase";
import { siteData } from "./data";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabaseClient } from "../util/supabase";

export interface UserData {
  email?: string;
  uid?: string;
  displayName?: string;
  photoURL?: string;
  joined?: number;
  discordId?: string;
}

interface UserProgress {
  xp: number;
  [key: string]: number;
}

export const userData = writable<UserData>(null);
export const userProgress = writable<UserProgress>(null);

let unsubData: RealtimeChannel;
let unsubProgress: RealtimeChannel;

supabaseClient.auth.onAuthStateChange((e, s) => {
  const sbUser = s?.user ?? null;
  if (sbUser) {

    unsubData = supabaseClient.channel("users").on<UserData>("postgres_changes", {
      event: '*',
      schema: 'public',
      filter: `uid=${sbUser.id}`
    }, (payload) => { userData.set(payload.new as UserData); }).subscribe();

    unsubProgress = supabaseClient.channel("progress").on<UserProgress>("postgres_changes", {
      event: '*',
      schema: 'public',
      filter: `uid=${sbUser.id}`
    }, (payload) => { userProgress.set(payload.new as UserProgress); }).subscribe();
    GASetUser(sbUser.id);
  } else {
    unsubData && unsubData.unsubscribe();
    unsubProgress && unsubProgress.unsubscribe();
    userData.set(null);
    userProgress.set(null);
    GASetUser(null);
  }
});

export const canAccess = derived(
  [userData, siteData],
  ([$userData, $siteData]) => {
    return true;
  },
);
