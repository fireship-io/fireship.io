<svelte:options tag="scroll-show" />

<script lang="ts">
  import { onMount } from 'svelte';
  export let delay = 200;
  export let start = 'right'
  export let repeat = true;

  let observer: IntersectionObserver;
  let ref: HTMLElement;
  let visible = false;

  onMount(() => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visible = true;
        } else {
          if (repeat) visible = false;
        }
      });
    });

    observer.observe(ref);

    return () => {
      observer?.disconnect();
    };
  });
</script>

<div bind:this={ref} class:visible class={start} style={`transition-delay: ${delay}ms`}>
  <slot />
</div>

<style lang="scss">
  @media (prefers-reduced-motion: no-preference) {
    .top {
      transform: translateY(-20px);
      filter: hue-rotate(90deg);
      opacity: 0;
      @apply relative transition-all duration-500;
    }
    .right {
      transform: translateX(-20px);
      filter: hue-rotate(90deg);
      opacity: 0;
      @apply relative transition-all duration-500;
    }
    .visible {
      transform: translateX(0);
      filter: hue-rotate(0);
      opacity: 1;
    }
  }
</style>
