<svelte:options tag="buy-lifetime" />

<script lang="ts">
  import { callUserAPI } from '../../util/firebase';
  import { products, toast } from '../../stores';
  let loading = false;
  export let enterprise = false;

  let text = enterprise ? 'upgrade my team' : 'upgrade for life';
  let price = enterprise ? products.enterprise.price : products.lifetime.price;
  let seats = 5;
  let url = '';

  function setSeats(val: number) {
    seats = val;
    if (seats < 5) {
      seats = 5;
      toast.set({ message: 'This plan has a 5 seat minimum', type: 'error' });
    }
    if (seats > 50) {
      seats = 50;
      toast.set({
        message: 'Maximum 50 seats. Contact for larger plans',
        type: 'error',
      });
    }
  }
  async function getSession() {
    loading = true;
    url = await callUserAPI<string>({
      fn: 'createPaymentSession',
      payload: {
        productType: enterprise ? 'enterprise' : 'lifetime',
        price,
        seats: enterprise ? seats : 1,
      },
    });

    if (url) window.open(url, '_blank')?.focus();
    loading = false;
  }
</script>

{#if enterprise}
  <div class="controls">
    <button class="btn-o" on:click={() => setSeats(seats - 1)}>-</button>
    <input
      type="number"
      bind:value={seats}
      on:change={(e) => setSeats(e.target.value)}
      min="5"
      max="50"
    />
    <button class="btn-o" on:click={() => setSeats(seats + 1)}>+</button>
  </div>
{/if}

<button
  on:click={getSession}
  class="btn"
  disabled={loading}
  class:btn-blue={enterprise}
>
  {#if loading}<loading-spinner />{/if}
  {loading ? 'loading...' : text}
</button>

{#if url}
  <a target="_blank" href={url}>Open Checkout Page</a>
{/if}

<style lang="scss">
  input {
    @apply outline-none border-none text-white mx-auto bg-gray7 p-2 w-12 text-center;
  }

  .btn {
    @apply bg-purple-500 text-white border-none hover:bg-purple-700 outline-none font-sans uppercase 
             font-bold inline-flex cursor-pointer text-center shadow-md no-underline px-5 py-2 text-sm my-0.5;
    &:disabled {
      @apply opacity-70 cursor-not-allowed;
    }
  }

  .btn-blue {
    @apply bg-blue-500 hover:bg-blue-700;
  }

  .btn-o {
    @apply font-sans cursor-pointer bg-gray6 m-0 text-xs text-gray3 border outline-none border-solid 
           rounded-sm border-orange-500 p-1.5 hover:bg-orange-500 hover:text-white transition-all;
  }
  .controls {
    @apply text-center my-3;
  }
  a {
  @apply text-blue-500 block text-center text-sm;
}
</style>
