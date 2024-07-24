import { supabaseSide } from "../../stores/supabase-vars";
import {
  deleteUserData, markComplete, markIncomplete,
  signInWithEirbConnect, signInWithGithub, supabaseSignOut
} from "./supabase";
import { toast } from "../../stores/";
import type { Unsubscriber } from "svelte/store";

export function listenAllSupabaseEvents(): Unsubscriber[] { 
  return [
  supabaseSide.onSignIn(async (provider) => {
    if (provider === 'github') await signInWithGithub();
    else await signInWithEirbConnect();
  }),

  supabaseSide.onSignOut(async () => { await supabaseSignOut(); }),

  supabaseSide.onUserDataDelete(async () => {
    const res = await deleteUserData();
    const deleted = !(!res || res.error);

    if (deleted) {
      await supabaseSignOut();
      toast.set({
        message: "Account terminated, good luck in your future endeavors",
        type: "success",
      });
    } else {
      if (res) console.error(res.error);
      toast.set({
        message: "An error has occured with the request.",
        type: "error"
      });
    }
  }),

  supabaseSide.onCourseMarked(async (markData) => {
    await markComplete(markData.route, markData.bonus);
  }),
  supabaseSide.onCourseUnmarked(async (markData) => {
    await markIncomplete(markData.route);
  })

  ];
}

export function unsubcribeAll(unsubscribers: Unsubscriber[]) {
  unsubscribers.forEach((u) => u());
}
