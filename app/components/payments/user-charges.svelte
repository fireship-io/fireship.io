<svelte:options tag="user-charges" />

<script lang="ts">
  import { callUserAPI } from '../../util/firebase';
  let loading = false;
  let charges = null;

  async function getCharges() {
    loading = true;
    const res =
      (await callUserAPI<any>({ fn: 'getCharges', payload: {} })) ?? [];
    charges = res.data || [];
    loading = false;
  }
</script>

{#if !charges}
  <button on:click={getCharges}>
    {#if loading}<loading-spinner />{/if}
    {loading ? 'loading...' : 'get receipts'}
  </button>
{/if}

{#if charges}
  <button on:click={() => (charges = null)}>Hide Receipts</button>
  <ul>
    {#each charges as ch}
      <li>
        <a target="_blank" href={ch.receipt_url}> {ch.id}</a> for
        <strong>${ch.amount / 100}</strong> on {new Date(ch.created * 1000).toLocaleDateString()}
      </li>
    {/each}
  </ul>
  {#if !charges.length}
    <p>No charges found</p>
  {/if}
{/if}

<style>
  button {
    @apply bg-blue-500 text-white border-none hover:bg-blue-600 active:bg-blue-700 font-sans uppercase 
             font-bold inline-flex cursor-pointer text-center no-underline px-5 py-2 text-sm;
  }
  a {
    @apply text-blue-500;
  }
</style>
