<svelte:options tag="change-email" />

<script lang="ts">
  import { toast } from '../../stores';
  import { callUserAPI, firebaseSignOut } from '../../util/firebase';
  let loading = false;
  let show = false;
  let confirmed = false;
  let isValid = false;
  let email = '';
  let emailEl: HTMLInputElement;

  function validate() {
    isValid = emailEl.validity.valid;
  }

  async function getSession() {
    loading = true;
    const changed = await callUserAPI<boolean>({
      fn: 'changeEmail',
      payload: { email },
    });

    if (changed) {
      await firebaseSignOut();
      toast.set({
        message: 'Email updated, please sign back in',
        type: 'success',
      });
    }

    loading = false;
  }
</script>

{#if show}
  <input
    type="email"
    bind:value={email}
    on:input={validate}
    bind:this={emailEl}
    placeholder="new email"
    required
  />

    {#if confirmed}
    <button
      class="btn btn-blue"
      on:click={getSession}
      disabled={loading || !isValid || !email}
    >
      {#if loading}<loading-spinner />{/if}
      {loading ? 'loading...' : 'confirm change'}
    </button>
    {:else}
    <button
      class="btn btn-blue"
      on:click={() => confirmed = true}
      disabled={loading || !isValid || !email}>
      change
    </button>
    {/if}
    
  <p class="warn">
    Be careful. If you enter the wrong email, you will not be able to access
    your account.
    <span on:click={() => (show = false)} class="info">nevermind</span>
  </p>
{:else}
  <span class="info" on:click={() => (show = true)}>change email</span>
{/if}

<style lang="scss">
  button {
    @apply bg-blue-500 text-white border-none hover:bg-blue-700 outline-none font-sans uppercase font-bold inline-flex cursor-pointer text-center shadow-md no-underline px-5 py-2 text-sm my-0.5;
    &:disabled {
      @apply opacity-70 cursor-not-allowed;
    }
  }
  .info {
    @apply text-blue-500 text-sm cursor-pointer;
  }
  input {
    @apply outline-none border-solid border-gray6 text-white bg-gray7 p-3 w-full font-sans mr-3 my-4;
  }

  .warn {
    @apply text-yellow-500 text-sm;
  }
</style>
