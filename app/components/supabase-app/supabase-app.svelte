<svelte:options customElement="supabase-app" />
<script lang="ts">
  import { fetchAndWatchUserRemoteData } from "./user-store-sync";
  import { onMount } from "svelte";

  onMount(async () => {
    await fetchAndWatchUserRemoteData();
  })
</script>
