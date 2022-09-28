<svelte:options tag="price-select" />

<script lang="ts">
  import { period } from '../../stores';
  export let show = 'amount';
  const prices = {
    month: 29,
    quarter: 69,
    year: 199,
  };
</script>

{#if show == 'amount'}
  {prices[$period]}<span class="period">/{$period}</span>
{/if}
{#if show == 'period'}
  <span>{$period}</span>
{/if}
{#if show == 'control'}
  <button
    class="btn"
    class:active={$period == 'month'}
    on:click={() => period.set('month')}>Month</button
  >
  <button
    class="btn"
    class:active={$period == 'quarter'}
    on:click={() => period.set('quarter')}>Quarter</button
  >
  <button
    class="btn"
    class:active={$period == 'year'}
    on:click={() => period.set('year')}>Year</button
  >
{/if}

<style lang="scss">
  .btn {
    @apply font-sans cursor-pointer bg-gray6 m-0 text-xs text-gray3 border outline-none border-solid 
           rounded-md border-orange-500 p-1.5 hover:bg-orange-500 hover:text-white transition-all;
    &.active {
      @apply bg-orange-500 text-white;
    }
  }
  .period {
    @apply font-sans text-base text-gray2;
  }
</style>
