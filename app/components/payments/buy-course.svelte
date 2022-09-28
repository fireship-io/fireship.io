<svelte:options tag="buy-course" />

<script lang="ts">
  import { callUserAPI } from '../../util/firebase';
  import { currentCourse } from '../../stores/pro';
  let loading = false;
  let url: string;

  async function getSession() {
    loading = true;
    url = await callUserAPI<string>({ fn: 'createPaymentSession', payload: { productId: $currentCourse.id, price: $currentCourse.price, productType: 'course' } });
    if (url) window.open(url, '_blank')?.focus();
    loading = false;
  }
  
</script>

  {#if $currentCourse?.price}
    <span on:click={getSession} class="btn">
      {#if loading}<loading-spinner />{/if}
      { loading ? 'loading...' : 'buy this course' }
    </span> 
      for <strong class="font-display">${$currentCourse?.amount}</strong>.
      
  {:else}
    <span class="btn yellow">Course not available for single purchase</span>
  {/if}


  
  {#if url}
    <a target="_blank" href={url}>Open Checkout Page</a>
  {/if}


<style lang="scss">
  .btn {
        @apply font-display text-blue-500 cursor-pointer text-xl;
        &.yellow {
          @apply text-yellow-500 cursor-default;
        }
    }

    a {
      @apply text-blue-500 block text-center text-sm;
    }
    
</style>