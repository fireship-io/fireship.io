<svelte:options tag="buy-pro" />

<script lang="ts">
  import { callUserAPI } from '../../util/firebase';
  import { trackCheckoutStart } from '../../util/analytics';
  import { products, period } from '../../stores';
  let loading = false;
  let url: string;

async function getSession() {
  loading = true;
  const price = products[$period].price;
  
  const purchaseData = {
    currency: 'USD',
    value: products[$period].amount,
    items: [{
      item_id: `pro_${$period}`,
      item_name: `PRO Subscription - ${$period}`,
      price: products[$period].amount,
      quantity: 1,
      item_category: 'subscription',
      item_variant: $period
    }]
  };
  
  trackCheckoutStart(purchaseData);
  
  url = await callUserAPI<string>({ 
    fn: 'createSubscriptionSession', 
    payload: { price } 
  });
  
  if (url) window.open(url, '_blank')?.focus();
  loading = false;
}
  
</script>

<button class="btn btn-blue" on:click={getSession} disabled={loading}>
  {#if loading}<loading-spinner />{/if}
  { loading ? 'loading...' : 'subscribe' }
</button>

{#if url}
  <a target="_blank" href={url}>Open Checkout Page</a>
{/if}


<style lang="scss">
.btn {
    @apply bg-blue-500 text-white border-none hover:bg-blue-700 outline-none font-sans uppercase 
             font-bold inline-flex cursor-pointer text-center shadow-md no-underline px-5 py-2 text-sm my-0.5;
    &:disabled {
      @apply opacity-70 cursor-not-allowed;
    }
}
a {
  @apply text-blue-500 block text-center text-sm;
}
</style>