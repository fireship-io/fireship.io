<svelte:options tag="mark-complete" />

<script lang="ts">
  import { canAccess, userProgress, modal } from '../../stores';
  import { markComplete, markIncomplete } from '../../util/firebase';
  export let route = window.location.pathname;
  export let quiz = false;
  export let free = false;

  async function mark(isComplete: boolean) {
    if (isComplete) {
      if (quiz) {
        modal.set('quiz');
        return;
      }
      await markComplete(route);
    } else {
      await markIncomplete(route);
    }
  }
</script>

<span class="wrap">
  {#if free || $canAccess}
    {#if $userProgress?.[route]}
      <button on:click={() => mark(false)} class="complete">
        <svg viewBox="0 0 512 512"
          ><path
            d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM371.8 211.8C382.7 200.9 382.7 183.1 371.8 172.2C360.9 161.3 343.1 161.3 332.2 172.2L224 280.4L179.8 236.2C168.9 225.3 151.1 225.3 140.2 236.2C129.3 247.1 129.3 264.9 140.2 275.8L204.2 339.8C215.1 350.7 232.9 350.7 243.8 339.8L371.8 211.8z"
          /></svg
        >
      </button>
      <span class="msg complete">done</span>
    {:else}
      <button on:click={() => mark(true)} class="incomplete">
        <svg viewBox="0 0 512 512"
          ><path
            d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"
          /></svg
        >
      </button>
      <span class="msg" class:pink={quiz}
        >{quiz ? 'pop quiz' : 'incomplete'}</span
      >
    {/if}
  {:else}
    <modal-action name="signin" type="open" class="purple">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="svg-sm"
        viewBox="0 0 448 512"
        ><path
          fill="currentColor"
          d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"
        /></svg
      >
    </modal-action>
    <span class="msg purple">locked</span>
  {/if}
</span>

<style lang="scss">
  button {
    background: none;
    @apply outline-none border-none rounded-full cursor-pointer hover:-translate-y-0.5 transition-transform;
  }
  svg {
    @apply w-8;
  }
  modal-action {
    @apply cursor-pointer;
  }
  .svg-sm {
    @apply w-5;
  }
  .msg {
    @apply text-xs relative text-yellow-500;
  }
  .pink {
    @apply text-pink-500;
  }
  .purple {
    @apply text-purple-500;
  }
  .incomplete {
    @apply fill-gray3 hover:fill-green-500;
  }
  .complete {
    @apply fill-green-500 text-green-500;
  }
  .wrap {
    @apply flex flex-col items-center justify-center min-w-[48px];
  }
</style>
