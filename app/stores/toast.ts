import { writable } from "svelte/store";

export interface Toast {
  message: string;
  type?: "success" | "error" | "info";
  icon?: string;
  delay?: number;
}

export const toast = writable<Toast|null>(null);

window.addEventListener("flamethrower:router:fetch", () => {
  toast.set(null);
});
