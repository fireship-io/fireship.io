<svelte:options tag="toast-message" />

<script lang="ts">
  import { onMount } from 'svelte';
  import { toast } from '../../stores/toast';
  let activate = false;
  let currentToast: any;
  let timeout: NodeJS.Timeout;
  let defaultIcons = {
    success: '✔️',
    error: '☠️',
    info: '💡'
  }

  onMount(() => {
    toast.subscribe(msg => {
      currentToast = msg;
      clearTimeout(timeout)
      if (msg) {
        timeout = setTimeout(() => {
          toast.set(null);
        }, msg?.delay || 10000);

        // delay hack for better animations
        activate = false
        setTimeout(() => {
          activate = true;
        }, 200);

      }
    })
  })

  $: typeClass = currentToast?.type || 'info';
</script>

{#if currentToast}
  <div class={`toast ${typeClass}`} on:click={() => toast.set(null)} class:active={activate}>
    <div class="message">
      {currentToast.message}
    </div>
    <div class="icon">
      {currentToast.icon ?? defaultIcons[currentToast.type ?? 'info']}
    </div>
  </div>
{/if}

<style lang="scss">
  .toast {
    border: none;
    @apply fixed bottom-6 right-6 m-6 flex cursor-pointer opacity-0 invisible translate-x-80 transition-all ease-in-out z-[999];

    &.active {
      @apply translate-x-0 visible opacity-100;
    }

    .icon {
      @apply text-white font-display shadow-xl text-lg w-10 px-2 py-1 grid place-items-center bg-black bg-opacity-80;
    }
    .message {
      @apply bg-black bg-opacity-50 text-white shadow-xl p-4 hover:line-through;
    }

    &.success {
      .message {
        @apply text-green-500;
      }
    }

    &.error {
      .message {
        @apply text-red-500;
      }
    }
  }
</style>
