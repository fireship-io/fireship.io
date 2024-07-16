import { writable } from "svelte/store";

interface SiteFundamentalData {
  permalink: string; next: string; prev: string; vimeo: string; free: string; youtube: string;
}
interface SiteDataWithVimeo extends SiteFundamentalData {
  vimeo: string
}
interface SiteDataWithYouTube extends SiteFundamentalData {
  youtube: string
}

export const siteData = writable<SiteDataWithVimeo | SiteDataWithYouTube>(
  null as unknown as SiteDataWithVimeo
);

export const rootURL = "https://formations.eirbware.eirb.fr";
