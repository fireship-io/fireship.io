<svelte:options customElement="sign-out" />

<script>
  import { firebaseSignOut } from "../../util/firebase";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span role="button" tabindex="0" on:click={firebaseSignOut}>
  <slot></slot>
</span>
