<svelte:options customElement="supabase-app" />
<script lang="ts">
  import { fetchAndWatchUserRemoteData } from "./user-store-sync";
  import { onMount } from "svelte";
  import { listenAllSupabaseEvents } from "./listen-events";


  onMount(async () => {
    listenAllSupabaseEvents();
    await fetchAndWatchUserRemoteData();
  })
</script>
