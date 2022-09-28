<svelte:options tag="seat-assign" />

<script lang="ts">
  import { callUserAPI } from '../../util/firebase';
  import { userData, seats } from '../../stores';

  let loading = false;
  let isValid = false;
  let email: string;
  let emailEl: HTMLInputElement;

  //   let seats: number;
  $: assignedSeats = Object.keys($seats?.assigned || {});

  function validate() {
    isValid = emailEl.validity.valid;
  }

  async function addSeat() {
    loading = true;
    await callUserAPI<string>({ fn: 'seatAssign', payload: { email } })
    loading = false;
    email = '';
  }

  async function removeSeat(rmEmail: string) {
    loading = true;
    await callUserAPI<string>({
      fn: 'seatAssign',
      payload: { email: rmEmail, revoke: true },
    })
    loading = false;
  }
</script>

{#if $userData?.enterprise}
  <h2>Assign Seats</h2>

  <p>You have used {assignedSeats.length} of {$seats?.seats} seats</p>

  <div class="wrap">

    {#if assignedSeats}
    
            {#each assignedSeats as seat}
            <div class="seat">
                {seat}
                <button
                class="btn btn-red"
                on:click={() => removeSeat(seat)}
                disabled={loading}>
                {'revoke'}
                </button>
            </div>
            {/each}
    
    {:else}
        <p>You have not assigned any seats yet</p>
    {/if}

        <div class="seat">
            <input type="email" bind:value={email} on:input={validate} bind:this={emailEl} placeholder="email" required />

            <button class="btn" on:click={addSeat} disabled={loading || !isValid || !email}>
            {#if loading}<loading-spinner />{/if}
            assign
            </button>
        </div>
    </div>



{/if}

<style lang="scss">
    .seat {
        @apply flex justify-between p-3 bg-gray6 my-1;
    }
  .btn {
    @apply font-sans cursor-pointer bg-gray6 m-0 text-xs text-gray3 border outline-none border-solid 
           rounded-sm border-blue-500 p-1.5 hover:bg-blue-500 hover:text-white transition-all;
    &:disabled {
      @apply opacity-60 cursor-not-allowed;
    }
  }
  .btn-red {
    @apply border-red-500 hover:bg-red-500 ml-2;
  }
  input {
    @apply outline-none border-none text-white bg-gray7 p-3 w-full font-sans mr-3;
  }
  .wrap {
    @apply flex flex-col max-w-[500px];
  }
</style>