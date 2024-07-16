<svelte:options customElement="user-avatar" />

<script lang="ts">
  import { userProgress } from "../../stores/user";
</script>

<div class="wrap">
  <user-data field="photoURL" />
</div>

<span class="xp" title="experience points">
  {$userProgress?.xp?.toLocaleString("en", { notation: "compact" }) ?? 0}
</span>

<style lang="scss">
  .wrap {
    @apply relative top-1 overflow-clip w-12;
  }

  .xp {
    @apply absolute top-0 -right-8 text-green-500 text-sm p-1 font-bold min-w-[5ch] text-center cursor-help bg-black bg-opacity-50 rounded-full shadow-xl;
  }
</style>
