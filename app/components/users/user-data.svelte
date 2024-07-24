<svelte:options customElement="user-data" />

<script lang="ts">
    import { onMount } from "svelte";
  import { userData, userProgress } from "../../stores/user";
    import { derived } from "svelte/store";
  export let field:
    | "email"
    | "photoURL"
    | "displayName"
    | "uid"
    | "xp"
    | "xp-raw";

  function formatXp(num: number) {
    let formatter = Intl.NumberFormat("en", { notation: "compact" });
    return formatter.format(num);
  }

  const DEFAULT_SRC = "/img/ui/avatar.svg";
  let force_default: boolean = false
  let src = derived(userData, (d) => {
    if (force_default) return DEFAULT_SRC;
    return d?.photoURL ?? DEFAULT_SRC
  });

  function relativeTime(date: number) {
    if (!date) return "never";
    let fmt = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    let diff = -Math.floor((Date.now() - date * 1000) / 1000) / 86400;
    return fmt.format(Math.floor(diff), "day");
  }

  // Don't even try to understand this code. It's needed to make sure legacy courses are shown.
</script>

{#if field === "email"}
  {$userData?.email}
{/if}
{#if field === "photoURL"}
  <img
    src={$src}
    alt="avatar"
    referrerpolicy="no-referrer"
    style="max-width: 100%; border-radius: 9999px;"
    on:error={() => { force_default = true; }}
  />
{/if}
{#if field === "displayName"}
  {$userData?.displayName}
{/if}
{#if field === "uid"}
  {$userData?.uid}
{/if}
{#if field === "xp"}
  {formatXp($userProgress?.xp ?? 0)}
{/if}
{#if field === "xp-raw"}
  {$userProgress?.xp?.toLocaleString() ?? 0}
{/if}
