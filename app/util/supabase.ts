import { createClient, type OAuthResponse } from "@supabase/supabase-js";

import { toast } from "../stores/toast";
import { modal } from "../stores/modal";
import { rootURL } from "../stores/data";
import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signOut,
} from "firebase/auth";

export const supabaseClient = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function signInWithGoogle() {
  const credential = supabaseClient.auth.signInWithOAuth({provider: 'google'});
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
  let res: OAuthResponse | undefined, serverError: string | undefined;
  try {
    res = await promise;
    modal.set(null);
    toast.set({
      message: "Access granted! Logged into the mainframe!",
      type: "success",
    });
  } catch (err: any) {
    serverError = err.message as string;
    console.error(err);
    toast.set({
      message: serverError,
      type: "error",
    });
  }
  return { res, serverError };
}

// Callable Functions

interface UserAPIData {
  fn: string;
  payload: any;
}

export async function callUserAPI<T>(data: UserAPIData): Promise<T> {
  try {
    if (!auth.currentUser) {
      modal.set("signin");
      toast.set({ message: "You must be signed in first", type: "info" });
      return;
    }
    const { getFunctions, httpsCallable } = await import("firebase/functions");
    const functions = getFunctions();

    const res = await httpsCallable(functions, "userAPI")(data);

    return res.data as T;
  } catch (error) {
    console.log(error);
    toast.set({
      message:
        error?.message ?? "Unknown Error. Contact hello@fireship.io for help",
      type: "error",
    });
  }
}

// Progress Tracking

export async function markComplete(route: string, bonus = 0) {
  const { data: { user: user} } = await supabaseClient.auth.getUser();

  if (!user) {
    toast.set({
      message: "You must be logged in to track progress",
      type: "error",
    });
    return;
  }

  const { data } = await supabaseClient
  .from("progress")
  .select("*")
  .eq("user_id", user.id);



  // Not my code
  const { doc, setDoc, getFirestore } = await import("firebase/firestore");
  const firestore = getFirestore();

  const userRef = doc(firestore, `progress/${user.id}`);
  setDoc(
    userRef,
    {
      [route]: 100 + bonus,
    },
    { merge: true },
  );
}

export async function markIncomplete(route: string) {
  const user = auth.currentUser;

  const { doc, setDoc, deleteField, getFirestore } = await import(
    "firebase/firestore"
  );
  const firestore = getFirestore();

  const userRef = doc(firestore, `progress/${user.uid}`);
  setDoc(
    userRef,
    {
      [route]: deleteField(),
    },
    { merge: true },
  );
}
