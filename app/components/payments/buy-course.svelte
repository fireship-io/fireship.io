<svelte:options tag="buy-course" />

<script lang="ts">
  import { callUserAPI } from '../../util/firebase';
  import { currentCourse } from '../../stores/pro';
  let loading = false;
  let url: string;

  async function getSession() {
    loading = true;

    const productId = $currentCourse.id;
    const productName = $currentCourse?.title || productId;
    const price = $currentCourse?.amount || 0;
    url = await callUserAPI<string>({ 
      fn: 'createPaymentSession', 
      payload: { 
        productId: productId, 
        price: $currentCourse.price, 
        productType: 'course' 
      } 
    });
    if (url) {
      window.dataLayer.push({
        'event': 'begin_checkout',
        'ecommerce': {
          'items': [{
            'item_id': productId,
            'item_name': productName,
            'item_category': 'course',
            'price': price,
            'quantity': 1
          }],
          'value': price,
          'currency': 'USD'
        }
      });
        console.log('GTM ecommerce event tracked:', {
          event: 'begin_checkout',
          product: productId,
          price: price
        });
      if (process.env.NODE_ENV !== 'production') {
        console.log('GTM ecommerce event tracked:', {
          event: 'begin_checkout',
          product: productId,
          price: price
        });
      }
      window.open(url, '_blank')?.focus();
    }
    loading = false;
  }
  
</script>

  {#if $currentCourse?.price}
    <span on:click={getSession} class="btn">
      {#if loading}<loading-spinner />{/if}
      { loading ? 'loading...' : 'buy this course' }
    </span> 
      for <strong class="font-display">${$currentCourse?.amount}...</strong>.
      
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