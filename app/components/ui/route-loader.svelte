<svelte:options tag="route-loader" />

<script lang="ts">
  import { routeLoading } from '../../stores/loading';
</script>


<div class="gradient-loader" class:show={$routeLoading}></div>

<style lang="scss">
  div {
    @apply fixed w-full top-0 left-0 h-1.5 opacity-0 -translate-x-full transition-all;
  }
  .show {
    @apply opacity-100 translate-x-0;
  }
  .gradient-loader {
    @apply bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500;
    background-size: 200% 200%;
    animation: gradiant-move 1s infinite;
  }
  @keyframes gradiant-move { 
    0%{background-position:left}
    50%{background-position:right}
    100%{background-position:left}
  }
</style>