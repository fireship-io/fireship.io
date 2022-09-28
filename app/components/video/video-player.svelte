<svelte:options tag="video-player" />

<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { router } from '../../main';
  import { UniversalPlayer } from '../../util/player';
  import  { autoplay, siteData, canAccess, currentCourse, toast } from '../../stores'

  export let video: number | string;
  export let type: 'vimeo' | 'youtube';
  export let free = false;
  export let single = false; // prevent autoplay on signle video pages

  // let player: Player;
  let ref: HTMLElement;
  let autoplayUnsub: Function;
  let showAutoplayCover = false;
  let timeout: NodeJS.Timeout;
  let countdown: NodeJS.Timeout;
  let countdownTime = 10;

  let player: UniversalPlayer;

  onMount(() => {
    video ||= $siteData?.vimeo || $siteData?.youtube;
    type = $siteData?.vimeo ? 'vimeo' : 'youtube';

    // Reload video player if user buys course
    const accessUnsub = canAccess.subscribe(async (can) => {
      if (video && !player && (can || free)) {
        await tick();
        initPlayer();
      }
    });

    // Cleanup: runs on disconnected (destroyed)
    return () => {
      player?.destroy();
      timeout && clearTimeout(timeout);
      countdown && clearInterval(countdown);
      autoplayUnsub && autoplayUnsub();
      accessUnsub();
    };
  });

  async function initPlayer() {

    player = await UniversalPlayer.create(video, ref, type);

    // Autoplay
    const autoplayReferral = window.location.search.includes('autoplay');
    autoplayUnsub = autoplay.subscribe((v) => {
      if (v && autoplayReferral) {
        player.play();
      }
    });

    // Route change on end
    player.onEnded(() => {
      if (!single && $autoplay && $siteData?.next) {
        showAutoplayCover = true;
        startCountdown();
        timeout = setTimeout(() => {
          router.go($siteData.next + '?autoplay=true');
        }, 10000);
      }

      if (!single && !$siteData?.next) {
        toast.set({
          message: 'Well done! You reached the end of this course.',
          type: 'success',
          icon: '🍰'
        });
      }
    });
  }

  function startCountdown() {
    clearInterval(countdown);
    countdown = setInterval(() => {
      countdownTime--;
    }, 1000);
  }

  function cancelAutoplay() {
    showAutoplayCover = false;
    countdownTime = 10;
    clearTimeout(timeout);
    clearInterval(countdown);
  }
</script>

{#if free || $canAccess}
  <div class="wrapper">
    <div class="vid" bind:this={ref} />
    <div class="autoplay-cover" class:active={showAutoplayCover}>
      <p>Autoplaying next video in <span class="big-text">{countdownTime}</span> seconds...</p>
      <div>
        <button class="btn" on:click={cancelAutoplay}>Cancel</button>
        <button class="btn btn-blue" on:click={() => router.go($siteData.next + '?autoplay=true')}>Go</button>
      </div>
    </div>
    <!-- total hack to prevent svelte from purging unused styles -->
    {#if false}<iframe title="placeholder" />{/if}
  </div>
{:else}
  <div class="upgrade-required">
    <if-user>
      <h5 class="denied">Permission Denied</h5>
      {#if $currentCourse?.price}
        <div class="buy-box">
          <buy-course></buy-course>
          <p class="text-light">Lifetime access for a blazingly low price</p>
        </div>
        <h3>OR</h3>
      {/if}

      <div class="buy-box green">              
        <p><a href="/pro/" class="text-pro">Upgrade to PRO</a></p>
        <p class="text-light">Unlock all Fireship content && bonus perks</p>
      </div>

      <modal-action slot="signed-out" name="signin" type="open">
        You must be <span class="hl-blue">signed in</span> to watch.
      </modal-action>
    </if-user>
  </div>
{/if}

<style lang="scss">
  .wrapper {
    @apply aspect-video w-full relative bg-black bg-opacity-50;
  }
  .autoplay-cover {
    @apply absolute inset-0 text-lg bg-black bg-opacity-95 hidden justify-center items-center flex-col;
  }
  .active {
    @apply flex;
  }
  .btn {
    @apply cursor-pointer bg-red-500 text-white font-display outline-none border-none px-4 py-2 mx-1;
  }
  .btn-blue {
    @apply bg-blue-500;
  }
  .upgrade-required {
    @apply aspect-video flex flex-col items-center justify-center text-center text-xl bg-black bg-opacity-75 animate-pulse;
  }
  .hl-blue {
    @apply font-display text-blue-500 cursor-pointer;
  }
  // .hl-green {
  //   @apply font-display text-green-500 cursor-pointer no-underline;
  // }
  .denied {
    @apply text-red-500 hidden md:block;
  }
  .big-text {
    @apply font-display text-4xl;
  }
  .buy-box {
    @apply bg-gray7 rounded-lg shadow-3xl p-6 max-w-sm mx-auto border-blue-500 border border-solid;
    &.green {
      @apply border-green-500 mt-4;
    }
    p {
      @apply my-0;
    }
  }
  .text-light {
    @apply mt-0 text-sm text-gray4;
  }
  .text-pro {
    @apply font-display text-green-500 no-underline text-xl;
  }
  h3 {
    @apply text-gray4 font-display hidden md:block;
  }
  iframe {
    @apply absolute top-0 left-0 w-full h-full;
  }
</style>
