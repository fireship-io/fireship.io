<svelte:options tag="email-signin" />

<script lang="ts">
  import { sendPasswordlessEmail } from '../../util/firebase';
  let emailEl: HTMLInputElement;
  let isValid = false;
  let isTouched = false;
  let loading = false;
  let confirmation: string;
  let error: string;

  function validate() {
    isValid = emailEl.validity.valid;
  }

  async function handleSubmit(e) {
    // toLowerCase
    const email = emailEl.value;
    const url = window.location.href;
    loading = true;
    const { res, serverError } = await sendPasswordlessEmail(email, url);
    loading = false;
    error = serverError;
    confirmation = res;
  }
</script>

<!-- <span on:click={signInWithEmail}>
    <slot></slot>
</span> -->

<form on:submit|preventDefault={handleSubmit}>
  <label for="email">Email</label>
  <input
    class="input"
    type="email"
    name="email"
    bind:this={emailEl}
    on:input={validate}
    on:focus|once={() => (isTouched = true)}
    class:touched={isTouched}
    required
  />
  {#if error}
    <p class="error">{error}</p>
  {/if}
  {#if confirmation}
    <p class="success">{confirmation}</p>
  {/if}

  <input class="btn" type="submit" value={loading ? 'sending...' : 'send'} class:disabled={!isValid || loading} />
</form>

<style>
  .input {
    @apply bg-gray7 bg-opacity-30 text-white text-lg block py-3 px-1 w-full border-b-4 border-b-white border-t-0 border-r-0 border-l-0 rounded-none outline-none focus-visible:outline-none;
  }
  label {
    @apply text-gray3 font-bold;
  }
  input[type='email']:valid {
    @apply border-b-green-500;
  }
  .btn {
    @apply bg-blue-500 font-sans text-white font-bold inline-block text-center shadow-md px-4 py-3 my-2 w-auto border-none cursor-pointer hover:bg-blue-500;
  }
  .disabled {
    @apply opacity-50 cursor-not-allowed;
  }
  .touched {
    @apply border-b-4 border-b-blue-500;
  }
  .error {
    @apply text-red-500 text-sm;
  }
  .success {
    @apply text-green-500 text-sm;
  }
</style>
