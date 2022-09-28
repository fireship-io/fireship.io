<svelte:options tag="user-invoices" />

<script lang="ts">
  import { callUserAPI } from '../../util/firebase';
  let loading = false;
  let invoices = null;

  async function getSession() {
    loading = true;
    const res =
      (await callUserAPI<any>({ fn: 'getInvoices', payload: {} })) ?? [];
    console.log(res);
    invoices = res.data || [];
    loading = false;
  }
</script>

{#if !invoices}
  <button on:click={getSession}>
    {#if loading}<loading-spinner />{/if}
    {loading ? 'loading...' : 'get invoices'}
  </button>
{/if}

{#if invoices}
  <button on:click={() => (invoices = null)}>Hide Invoices</button>
  <ul>
    {#each invoices as inv}
      <li>
        <a target="_blank" href={inv.hosted_invoice_url}> {inv.id}</a> for
        <strong>${inv.amount_due / 100}</strong> on {new Date(inv.created * 1000).toLocaleDateString()}
      </li>
    {/each}
  </ul>

  {#if !invoices.length}
    <p>No invoices found</p>
  {/if}
{/if}

<style>
  button {
    @apply bg-blue-500 text-white border-none hover:bg-blue-600 active:bg-blue-700 font-sans 
             uppercase font-bold inline-flex cursor-pointer text-center no-underline px-5 py-2 text-sm;
  }
  a {
    @apply text-blue-500;
  }
</style>
