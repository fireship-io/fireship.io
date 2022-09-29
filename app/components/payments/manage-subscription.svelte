<svelte:options tag="manage-subscription" />

<script lang="ts">
  import { callUserAPI } from '../../util/firebase';
  import { toast } from '../../stores';
  let loading = false;
  let subs = null;

  function relativeTime(date: number) {
    if (!date) return 'never';
    let fmt = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    let diff = -Math.floor((Date.now() - date * 1000) / 1000) / 86400;
    return fmt.format(Math.floor(diff), 'day');
  }

  async function getSubscriptions() {
    loading = true;
    const res = await callUserAPI<any>({ fn: 'getSubscriptions', payload: {} });
    subs = res?.data || [];
    console.log(subs)
    loading = false;
  }

  async function cancel(subscription: string) {
    loading = true;
    const res = await callUserAPI<any>({
      fn: 'cancelSubscription',
      payload: { subscription },
    });
    if (res) {
      await getSubscriptions();
      toast.set({
        message: 'Subscription canceled. It was fun while it lasted',
        type: 'info',
      });
    }
    loading = false;
  }

  async function uncancel(subscription: string) {
    loading = true;
    const res = await callUserAPI<any>({
      fn: 'unCancelSubscription',
      payload: { subscription },
    });
    if (res) {
      await getSubscriptions();
      toast.set({ message: 'Subscription reactivated!', type: 'success' });
    }
    loading = false;
  }
</script>

{#if !subs}
  <button on:click={getSubscriptions}>
    {#if loading}<loading-spinner />{/if}
    {loading ? 'loading...' : 'manage subscription'}
  </button>
{/if}

{#if subs}
  <button on:click={() => (subs = null)}> Hide Subscriptions </button>
  {#if subs.length}
    {#each subs as sub}
      <section>
        <h3>ID: {sub.id}</h3>
        <p>PRO Status: {sub.status}</p>
        <p>
          Plan: ${sub.plan.amount / 100} 
          per {sub.plan.interval_count} {sub.plan.interval_count > 1 ? sub.plan.interval + 's' : sub.plan.interval}
        </p>
        {#if sub.discount}
          <p>Discount: %{sub.discount.coupon.percent_off} off {sub.discount.coupon.duration}</p>
        {/if}

        {#if !sub.canceled_at}
          <p>Next payment {relativeTime(sub.current_period_end)}</p>
          <button
            class="cancel"
            on:click={() => cancel(sub.id)}
            disabled={loading}
          >
            {#if loading}<loading-spinner />{/if}
            Cancel Subscription
          </button>
        {/if}

        {#if sub.canceled_at && sub.status === 'active'}
          <p class="warn">
            Your subscription is canceled. PRO access will end {relativeTime(
              sub.cancel_at
            )}
          </p>
          <button
            class="undo"
            on:click={() => uncancel(sub.id)}
            disabled={loading}
          >
            {#if loading}<loading-spinner />{/if}
            Undo Cancellation
          </button>
        {/if}
      </section>
    {/each}
  {:else}
    <p>No subscriptions found</p>
  {/if}
{/if}

<style lang="scss">
  section {
    @apply p-6 my-4 bg-gray6 rounded-lg;
  }
  button {
    @apply border-none bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 font-sans uppercase font-bold 
           inline-flex cursor-pointer text-center no-underline px-5 py-2 text-sm;
    &:disabled {
      @apply opacity-70 cursor-not-allowed;
    }
  }
  .cancel {
    @apply bg-red-500 hover:bg-red-600 active:bg-red-700;
  }
  .undo {
    @apply bg-green-500 hover:bg-green-600 active:bg-green-700;
  }
  .warn {
    @apply text-yellow-500;
  }
</style>
