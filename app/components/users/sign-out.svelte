<svelte:options customElement="sign-out" />

<script>
  import { supabaseSignOut } from "../../util/supabase";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span role="button" tabindex="0" on:click={supabaseSignOut}>
  <slot></slot>
</span>
