import { writable } from "svelte/store";

export type SettableBoolean = boolean | null;

export const doesPreferDark = writable<SettableBoolean>(
  JSON.parse(localStorage?.theme ?? null),
);
doesPreferDark.subscribe((v) => {
  if (v === null) localStorage.removeItem("theme");
  else localStorage.theme = v;
});
