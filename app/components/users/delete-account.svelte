<svelte:options tag="delete-account" />

<script lang="ts">
  import { toast } from '../../stores';
  import { callUserAPI, firebaseSignOut } from '../../util/firebase';
  let loading = false;
  let show = false;
  let firstClick = false;

  async function handleDelete() {
    loading = true;
    const deleted = await callUserAPI<boolean>({ fn: 'deleteAccount', payload: {  } });

    if (deleted) {
        await firebaseSignOut();
        toast.set({ message: 'Account terminated, good luck in your future endeavors', type: 'success' });
    }
    
    loading = false;
  }

  function reset() {
    show = false;
    firstClick = false;
  }

  $: btnText = firstClick ? 'confirm destruction' : 'delete account';
  
</script>

{#if show}

    <button class="btn btn-red" on:click={() => firstClick ? handleDelete() : (firstClick = true)} disabled={loading}>
        {#if loading}<loading-spinner />{/if}
        { loading ? 'terminating...' : btnText }
    </button>
    {#if firstClick}
        <p class="warn">
            Final warning! Once you click this button there's no going back. All account data is lost forever. 
            <span on:click={reset} class="info">nevermind</span>
        </p>
    {/if}
        
{:else}
    <span class="info" on:click={() => show = true}>Delete this Account</span>
{/if}





<style lang="scss">
  .btn {
      @apply bg-red-500 text-white border-none hover:bg-red-700 outline-none font-sans uppercase font-bold inline-flex cursor-pointer text-center shadow-md no-underline px-5 py-2 text-sm my-0.5;
      &:disabled {
        @apply opacity-70 cursor-not-allowed;
      }
  }
  .info {
    @apply text-blue-500 text-sm cursor-pointer;
  }
  .warn {
    @apply text-yellow-500 text-sm;
  }

</style>