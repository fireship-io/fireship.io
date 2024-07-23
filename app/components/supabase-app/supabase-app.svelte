<svelte:options customElement="supabase-app" />
<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { fetchAndWatchUserRemoteData } from "./user-store-sync";
  import { listenAllSupabaseEvents, unsubcribeAll } from "./listen-events";
  import type { Unsubscriber } from "svelte/store";

  let userDataSubscription: (() => void) | null = null;
  let supabaseSvelteStoresSubscriptions: Unsubscriber[] = [];

  onMount(async () => {
    userDataSubscription = await fetchAndWatchUserRemoteData();
    supabaseSvelteStoresSubscriptions = listenAllSupabaseEvents();
  });
  onDestroy(() => {
    if (userDataSubscription) userDataSubscription();
    unsubcribeAll(supabaseSvelteStoresSubscriptions);
  });
</script>
