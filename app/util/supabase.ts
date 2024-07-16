import { createClient, REALTIME_LISTEN_TYPES, REALTIME_POSTGRES_CHANGES_LISTEN_EVENT, RealtimeChannel, type OAuthResponse, type RealtimePostgresChangesFilter, type RealtimePostgresChangesPayload, type User } from "@supabase/supabase-js";
import * as SupabaseTypes from "./supabase.types";

import { toast } from "../stores/toast";
import { modal } from "../stores/modal";

type UsersTableKey = keyof SupabaseTypes.Database["public"]["Tables"]["users"]["Row"];
type ProgressTableKey = keyof SupabaseTypes.Database["public"]["Tables"]["progress"]["Row"];
const USER_ID_KEY__USERS: UsersTableKey = 'uid';
const USER_ID_KEY__PROGRESS: ProgressTableKey = 'user_id';
const COURSE_ROUTE_KEY__PROGRESS: ProgressTableKey = 'course_route';

const supabaseClient = createClient<SupabaseTypes.Database>(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

async function getUser() {
  return (await supabaseClient.auth.getUser()).data.user;
}

// Login

export async function signInWithGithub() {
  const credential = supabaseClient.auth.signInWithOAuth({
    provider: 'github',
  });
  return loginHandler(credential);

}

export async function signInWithEirbConnect() {
  const credential = supabaseClient.auth.signInWithOAuth({
    provider: 'keycloak',
    options: { scopes: 'openid' }
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
    modal.set(null as unknown as string);
    toast.set({
      message: "Access granted! Logged into the mainframe!",
      type: "success",
    });
  }
  return { res: data, serverError };
}

// Realtime Watchers

export const onAuthStateChange = (callback: Parameters<typeof supabaseClient.auth.onAuthStateChange>[0]) => supabaseClient.auth.onAuthStateChange(callback);

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
type UserDataType = SupabaseTypes.Database["public"]["Tables"]["users"]["Row"];
type ProgressDataType = SupabaseTypes.Database["public"]["Tables"]["progress"]["Row"];

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

function callIfAuthenticated<
  Params extends any[],
  Err extends { message: string },
  PostgresResult extends { error: Err | null }
>(fn: (user: User, ...params: Params) => Promise<PostgresResult>):
  (...params: Params) => Promise<PostgresResult | null> {
  return async (...params: Params) => {
    const user = await getUser();
    if (!user) {
      modal.set("signin");
      toast.set({ message: "You must be signed in first", type: "info" });
      return null;
    }
    try {
      const res = await fn(user, ...params);
      const error = res.error;
      if (error) throw error;
      return res;
    }
    catch (error: any) {
      console.log(error);
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
  await callIfAuthenticated(async (user) =>
    await supabaseClient
      .from("progress")
      .upsert({
        user_id: user.id,
        course_route: route,
        xp: 100 + bonus,
      }, {
        onConflict: `${USER_ID_KEY__PROGRESS},${COURSE_ROUTE_KEY__PROGRESS}`
      })
  )();
}

export async function markIncomplete(route: string) {
  await callIfAuthenticated(async (user) =>
    await supabaseClient.from("progress")
      .delete()
      .eq("user_id", user.id)
      .eq("course_route", route)
  )();
}
