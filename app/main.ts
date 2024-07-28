console.log(
  `%c  
█████████████████████████████████████████████████████████████████████
█▄─▄▄─█▄─▄█▄─▄▄▀█▄─▄─▀█░██▀▄─██─▄▄▄─██▀▄─██▄─▄▄▀█▄─▄▄─█▄─▀█▀─▄█▄─█─▄█
██─▄█▀██─███─▄─▄██─▄─▀█▄██─▀─██─███▀██─▀─███─██─██─▄█▀██─█▄█─███▄─▄██
▀▄▄▄▄▄▀▄▄▄▀▄▄▀▄▄▀▄▄▄▄▀▀▀▀▄▄▀▄▄▀▄▄▄▄▄▀▄▄▀▄▄▀▄▄▄▄▀▀▄▄▄▄▄▀▄▄▄▀▄▄▄▀▀▄▄▄▀▀`,
  "font-family:monospace; color: rgb(255, 228, 40);",
);

// Global code
import "../styles/app.scss";
import flamethrower from "flamethrower-router";
import { scrollSave } from "./util/scroll";
import "./util/key-bindings";

// saves scroll position on navbar
scrollSave();

// Router
export const router = flamethrower({ prefetch: "hover", log: false });

// All web components must be exported here
export * from "./components/global-data.svelte";
export * from './components/supabase-app';

// Auth
export * from "./components/users/user-data.svelte";
export * from "./components/users/github-signin.svelte";
export * from "./components/users/roulade-signin.svelte";
export * from "./components/users/sign-out.svelte";
export * from "./components/users/app-signin.svelte";
export * from "./components/users/if-pro.svelte";
export * from "./components/users/if-user.svelte";
export * from "./components/users/if-access.svelte";
export * from "./components/users/user-avatar.svelte";
export * from "./components/users/delete-account.svelte";

// Progress Tracking
export * from "./components/progress/mark-complete.svelte";
export * from "./components/progress/complete-icon.svelte";
export * from "./components/progress/quiz-modal.svelte";

// UI
export * from "./components/ui/modal-action.svelte";
export * from "./components/ui/modal-dialog.svelte";
export * from "./components/ui/route-loader.svelte";
export * from "./components/ui/toast-message.svelte";
export * from "./components/ui/navbar-toggle.svelte";
export * from "./components/ui/img-reveal.svelte";
export * from "./components/ui/scroll-show.svelte";
export * from "./components/ui/discord-count.svelte";
export * from "./components/ui/scroll-up.svelte";
export * from "./components/ui/hi-mom.svelte";
export * from "./components/ui/dark-mode.svelte";
export * from "./components/ui/tab-switch";

// Search
export * from "./components/search/algolia-search.svelte";

// Video
export * from "./components/video/video-player.svelte";
export * from "./components/video/autoplay-toggle.svelte";

// Shared
export * from "./components/ui/loading-spinner.svelte";
