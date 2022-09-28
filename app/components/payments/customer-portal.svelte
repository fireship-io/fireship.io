<svelte:options tag="customer-portal" />

<script lang="ts">
  import { callUserAPI } from '../../util/firebase';
  let loading = false;

  async function getSession() {
    loading = true;
    const redirectURL = await callUserAPI<string>({ fn: 'createPortalSession', payload: { } });
    if (redirectURL) window.open(redirectURL, '_blank')?.focus();
    loading = false;
  }
</script>

<button on:click={getSession}>
  {#if loading}<loading-spinner />{/if}
  { loading ? 'loading...' : 'subscription & invoices' }
</button>

<style>
button {
    @apply border-none bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 font-sans 
           uppercase font-bold inline-flex cursor-pointer text-center no-underline px-5 py-2 text-sm;
}
</style>