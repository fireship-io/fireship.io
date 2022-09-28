<svelte:options tag="global-data" />

<script lang="ts">
  import { onMount } from 'svelte';
  import { siteData } from '../stores/data';

  export let permalink: string;
  export let next: string;
  export let prev: string;
  export let vimeo: string;
  export let youtube: string;
  export let free: string;

  onMount(() => {
    siteData.set({ permalink, next, prev, vimeo, free, youtube });
  });
</script>
