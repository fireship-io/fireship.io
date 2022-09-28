<svelte:options tag="update-payment" />

<script lang="ts">
  import { callUserAPI } from '../../util/firebase';
  let loading = false;
  let methods;
  let url;

  async function getDefault() {
    loading = true;
    const res = await callUserAPI<any>({
      fn: 'getPaymentMethods',
      payload: {},
    });
    methods = res?.data || [];
    loading = false;
  }

  async function detachMethod(pm: string) {
    loading = true;
    const res = await callUserAPI<any>({
      fn: 'deletePaymentMethod',
      payload: { pm },
    });
    if (res) {
      await getDefault();
    }
    loading = false;
  }

  async function getSession() {
    loading = true;
    url = await callUserAPI<string>({ fn: 'createSetupSession', payload: {} });
    if (url) window.open(url, '_blank')?.focus();
    loading = false;
  }
</script>

{#if !methods}
  <button on:click={getDefault}>
    {#if loading}<loading-spinner />{/if}
    {loading ? 'loading...' : 'update payment method'}
  </button>
{/if}

{#if methods}
  <button on:click={() => (methods = null)}>Hide Payment Methods</button>

  <div class="wrap">
    <h3>Payment Methods</h3>

    {#if methods.length}
      <ul>
        {#each methods as method}
          <li>
            {method.card.brand} ending in {method.card.last4} expires {method
              .card.exp_month}/{method.card.exp_year}
            <span class="warn" on:click={() => detachMethod(method.id)}
              >delete</span
            >
          </li>
        {/each}
      </ul>
    {:else}
      <p>No payment methods found</p>
    {/if}

    <button class="update" on:click={getSession}>
      {#if loading}<loading-spinner />{/if}
      {loading ? 'loading...' : 'Add new card'}
    </button>

    {#if url}
      <a href={url}>Card Update Screen</a>
    {/if}
  </div>
{/if}

<style>
  button {
    @apply border-none bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 font-sans 
           uppercase font-bold inline-flex cursor-pointer text-center no-underline px-5 py-2 text-sm;
  }
  .update {
    @apply bg-green-500 hover:bg-green-600 active:bg-green-700;
  }
  a {
    @apply text-blue-500 block text-sm;
  }
  .warn {
    @apply text-red-500 cursor-pointer;
  }
  .wrap {
    @apply mt-16 mb-24;
  }
</style>
