import { writable } from "svelte/store";
export const siteData = writable<{
permalink: string; next: string; prev: string; vimeo: string; free:string; youtube: string; 
}>(null);

export const rootURL = "https://formations.eirbware.eirb.fr";
