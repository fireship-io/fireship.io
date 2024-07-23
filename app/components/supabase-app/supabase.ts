import { createClient, REALTIME_LISTEN_TYPES, REALTIME_POSTGRES_CHANGES_LISTEN_EVENT, RealtimeChannel, type OAuthResponse, type RealtimePostgresChangesFilter, type RealtimePostgresChangesPayload, type User } from "@supabase/supabase-js";
import * as SupabaseTypes from "./supabase.types";

import { toast } from "../../stores/toast";
import { modal } from "../../stores/modal";

type UsersTableKey = keyof SupabaseTypes.Database["public"]["Tables"]["users"]["Row"];
type ProgressTableKey = keyof SupabaseTypes.Database["public"]["Tables"]["progress"]["Row"];
const USER_ID_KEY__USERS: UsersTableKey = 'uid';
const USER_ID_KEY__PROGRESS: ProgressTableKey = 'user_id';
const COURSE_ROUTE_KEY__PROGRESS: ProgressTableKey = 'course_route';

const supabaseClient = createClient<SupabaseTypes.Database>(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
let currentUser: User | null = null;

/** @return The loaded user from the session
 * Call this promise at the refreshing of each static page so the
 * supabaseClient can next correctly perform its requests.
 */
export async function refreshUserSession() {
  currentUser = (await supabaseClient.auth.getSession())?.data.session?.user ?? null;
  return currentUser;
}

// Login

export async function signInWithGithub() {
  const credential = supabaseClient.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: window.location.href }
  });
  return loginHandler(credential);

}

export async function signInWithEirbConnect() {
  const credential = supabaseClient.auth.signInWithOAuth({
    provider: 'keycloak',
    options: { scopes: 'openid', redirectTo: window.location.href }
  });
  return loginHandler(credential);
}

export async function supabaseSignOut() {
  await supabaseClient.auth.signOut();
  toast.set({
    icon: "👋",
    message: "Thanks for hanging out, see ya around!",
  });
}

async function loginHandler(promise: Promise<OAuthResponse>) {
  const { data, error } = await promise;
  let serverError = null;
  if (error) {
    serverError = error.message;
    console.error(error);
    toast.set({
      message: serverError,
      type: "error",
    });
  } else {
    modal.set(null);
    toast.set({
      message: "Access granted! Logged into the mainframe!",
      type: "success",
    });
  }
  return { res: data, serverError };
}

// Select user data

export async function fetchUserData(userUid: string) {
  const { data, error } = await supabaseClient.from('users').select().eq("uid", userUid);
  // TODO: review the error handling
  if (error && !data) {
    console.error("unable to correctly fetch user data:", error.message)
    return null;
  } ;
  return data[0];
}

export async function fetchUserProgressData(userUid: string) {
  const { data, error } = await supabaseClient.from('progress').select().eq("user_id", userUid);
  // TODO: review the error handling
  if (error && !data) {
    console.error("unable to correctly fetch user progress data:", error.message)
    return null;
  } ;
  return data;
}

// Realtime Watchers

type AuthCallback = Parameters<typeof supabaseClient.auth.onAuthStateChange>[0];

// Create a user row if it signin for the first time.

const createUserIfDoesNotExist: AuthCallback = async (_, session) => {
  async function userExist(userUid: string): Promise<boolean> {
    const { data, error } = await supabaseClient.from('users').select().eq("uid", userUid);
    // TODO: review the error handling
    if (error) console.error("ça n'a pas marché:", error.message);
    return data !== null && data.length > 0;
  }
  const userUid = session?.user.id;
  if (!userUid || await userExist(userUid)) return;
  const githubMetadata = session.user.user_metadata;
  const { error } = await supabaseClient.from('users').insert({
    uid: userUid, email: session.user.email!, joined: 0, photoURL: githubMetadata["avatar_url"], displayName: githubMetadata["full_name"]
  });
    // TODO: review the error handling
  if (error) console.error("L'authentification n'a pas marché:", error.message);
};

export const onAuthStateChange = (callback: AuthCallback) =>
supabaseClient.auth.onAuthStateChange(async (event, session) => { 
    currentUser = session?.user ?? null;
    await createUserIfDoesNotExist(event, session);
    await callback(event, session);
});


type OnType<T extends { [key: string]: any }> = (
  type: `${REALTIME_LISTEN_TYPES.POSTGRES_CHANGES}`,
  filter: RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL}`>,
  callback: (payload: RealtimePostgresChangesPayload<T>) => void
) => RealtimeChannel
  ;

function createChannelForAllPostgresChanges<T extends { [key: string]: any }>(channelKey: string): (
  filter: Parameters<OnType<T>>[1], callback: Parameters<OnType<T>>[2]
) => RealtimeChannel {
  const onFunction: OnType<T> = (type, filter, callback) => supabaseClient.channel(channelKey).on<T>(type, filter, callback);
  return (filter, callback) => onFunction("postgres_changes", filter, callback);
}

type Callback<T extends { [key: string]: any }> = (payload: RealtimePostgresChangesPayload<T>) => void;
export type UserDataType = SupabaseTypes.Database["public"]["Tables"]["users"]["Row"];
export type ProgressDataType = SupabaseTypes.Database["public"]["Tables"]["progress"]["Row"];

export const onProgressChange = (sbUser: User, callback: Callback<ProgressDataType>) =>
  createChannelForAllPostgresChanges<ProgressDataType>("progress_change")(
    {
      event: '*',
      schema: 'public',
      table: 'progress',
      filter: `${USER_ID_KEY__PROGRESS}=eq.${sbUser.id}`
    }, callback);

export const onUserChange = (sbUser: User, callback: Callback<UserDataType>) =>
  createChannelForAllPostgresChanges<UserDataType>("user_changes")(
    {
      event: '*',
      schema: 'public',
      table: 'users',
      filter: `${USER_ID_KEY__USERS}=eq.${sbUser.id}`
    }, callback);

// Callable Functions

/** This function runs whatevej postgres request only for an authenticated user
  */
function callIfAuthenticated<
  Params extends any[],
  Err extends { message: string },
  PostgresResult extends { error: Err | null }
>(fn: (user: User, ...params: Params) => Promise<PostgresResult>):
  (...params: Params) => Promise<PostgresResult | null> {
  return async (...params: Params) => {
    const user = currentUser;
    if (!user) {
      modal.set("signin");
      toast.set({ message: "You must be signed in first", type: "info" });
      return null;
    }
    try {
      console.log("starting supabase request...");
      const res = await fn(user, ...params);
      const error = res.error;
      if (error) throw error;
      return res;
    }
    catch (error: any) {
      console.error(error);
      toast.set({
        message:
          error?.message ?? "Unknown Error. Contact eirbware@enseirb-matmeca.fr for help",
        type: "error",
      });
      return null;
    }
  }
}

// RGPD

export function deleteUserData() {
  return callIfAuthenticated(async (user: User) => await supabaseClient.from("users").delete().eq("uid", user.id))();
}


export async function changerUserEmail(newEmail: string) {
  return await callIfAuthenticated(async (user: User) => await supabaseClient.from("users").update({
    email: newEmail
  }).eq('uid', user.id)
  )();
}

// Progress Tracking

export async function markComplete(route: string, bonus = 0) {
  await (callIfAuthenticated(async (user) =>
    supabaseClient
      .from("progress")
      .upsert({
        user_id: user.id,
        course_route: route,
        xp: 100 + bonus,
      }, {
        onConflict: `${USER_ID_KEY__PROGRESS},${COURSE_ROUTE_KEY__PROGRESS}`
      })
  ))();
}

export async function markIncomplete(route: string) {
  await callIfAuthenticated(async (user) =>
    await supabaseClient.from("progress")
      .delete()
      .eq("user_id", user.id)
      .eq("course_route", route)
  )();
}
