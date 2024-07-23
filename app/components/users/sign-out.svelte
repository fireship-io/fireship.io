<svelte:options customElement="sign-out" />

<script>
  import { componentsSide } from "../../stores/supabase-vars";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span role="button" tabindex="0" on:click={() => componentsSide.signOut()}>
  <slot></slot>
</span>
