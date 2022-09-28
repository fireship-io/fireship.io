<svelte:options tag="update-address" />

<script lang="ts">
  import { callUserAPI } from '../../util/firebase';
  import { writable } from 'svelte/store';
  import { toast } from '../../stores';
  const name = writable('');
  const address = writable({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
  });
  let show = false;
  let loading = false;

  async function getCustomer() {
    loading = true;
    const cust = await callUserAPI<any>({ fn: 'getCustomer', payload: {} });
    cust?.name && name.set(cust.name);
    cust?.address && address.set(cust.address);

    loading = false;
    show = true;
  }

  async function changeAddress() {
    loading = true;
    const res = await callUserAPI<any>({
      fn: 'changeAddress',
      payload: { address: $address, name: $name },
    });

    if (res) {
      toast.set({ message: 'Address updated', type: 'success' });
      show = false;
    }
    loading = false;
  }
</script>

{#if !show}
  <button on:click={getCustomer}>
    {#if loading}<loading-spinner />{/if}
    update address
  </button>
{/if}

{#if show}
  <button on:click={() => (show = false)}> Hide Address </button>

  <p>
    This form will update your address in stripe and be reflected on invoices
  </p>

  <form>
    <label for="name">Name</label>
    <input name="name" type="text" maxlength="100" bind:value={$name} />
    <label for="line1">Line 1</label>
    <input
      name="line1"
      type="text"
      maxlength="100"
      bind:value={$address.line1}
    />
    <label for="line2">Line 2</label>
    <input
      name="line2"
      type="text"
      maxlength="100"
      bind:value={$address.line2}
    />
    <label for="city">City</label>
    <input name="city" type="text" maxlength="50" bind:value={$address.city} />
    <label for="state">State</label>
    <input
      name="state"
      type="text"
      maxlength="50"
      bind:value={$address.state}
    />
    <label for="postal_code">Postal Code</label>
    <input
      name="postal_code"
      type="text"
      maxlength="20"
      bind:value={$address.postal_code}
    />
    <label for="country">Country Code (2 Digit)</label>
    <input
      name="country"
      type="text"
      maxlength="2"
      bind:value={$address.country}
    />
  </form>

  <button class="update" on:click={changeAddress}>
    {#if loading}<loading-spinner />{/if}
    {loading ? 'updating...' : 'save address'}
  </button>
{/if}

<style>
  button {
    @apply bg-blue-500 text-white border-none hover:bg-blue-600 active:bg-blue-700 font-sans uppercase 
             font-bold inline-flex cursor-pointer text-center no-underline px-5 py-2 text-sm;
  }
  .update {
    @apply bg-green-500 hover:bg-green-600 active:bg-green-700 mb-20;
  }
  input {
    @apply outline-none border-solid border-gray6 text-white bg-gray7 p-3 w-full font-sans mr-3 mb-4;
  }
</style>
