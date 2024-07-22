import { derived } from "svelte/store";
import { siteData } from "./data";
import { createCachedWritable } from "../util/helpers";

export interface UserData {
  email?: string;
  uid?: string;
  displayName?: string;
  photoURL?: string;
  discordId?: string;
}

export interface UserProgress {
  xp: number;
  [key: string]: number;
}

const { cachedWritable: userData } = createCachedWritable<UserData>('userData');
const { cachedWritable: userProgress } = createCachedWritable<UserProgress>('userProgress');

const canAccess = derived(
  // TODO: remove this if useless or restrict access if needed
  [userData, siteData],
  ([$userData, $siteData]) => {
    return true;
  },
);

export { userData, userProgress, canAccess };
