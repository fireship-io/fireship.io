<svelte:options customElement="video-player" />

<script lang="ts">
  import { onMount, tick } from "svelte";
  import { router } from "../../main";
  import { UniversalPlayer } from "../../util/player";
  import {
    autoplay,
    siteData,
    canAccess,
    toast,
  } from "../../stores";

  export let video: number | string;
  export let type: "vimeo" | "youtube";
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
    video ||= $siteData?.vimeo || $siteData.youtube;
    type = $siteData?.vimeo ? "vimeo" : "youtube";

    // Reload video player if user buys course
    const accessUnsub = canAccess.subscribe(async (can) => {
      if (video && !player && (can)) {
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
    const autoplayReferral = window.location.search.includes("autoplay");
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
          router.go($siteData.next + "?autoplay=true");
        }, 10000);
      }

      if (!single && !$siteData?.next) {
        toast.set({
          message: "Well done! You reached the end of this course.",
          type: "success",
          icon: "🍰",
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

<div class="wrapper">
  <div class="vid" bind:this={ref}></div>
  <div class="autoplay-cover" class:active={showAutoplayCover}>
    <p>
      Autoplaying next video in <span class="big-text">{countdownTime}</span> seconds...
    </p>
    <div>
      <button class="btn" on:click={cancelAutoplay}>Cancel</button>
      <button
        class="btn btn-blue"
        on:click={() => router.go($siteData.next + "?autoplay=true")}
        >Go</button
      >
    </div>
  </div>
</div>

<style lang="scss">
  .wrapper {
    @apply aspect-video w-full relative bg-black bg-opacity-50;
  }
  .vid {
    @apply w-full h-full
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
  .big-text {
    @apply font-display text-4xl;
  }
</style>
