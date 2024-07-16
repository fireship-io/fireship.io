<svelte:options customElement="if-user" />

<!-- Is signed in  -->

<script lang="ts">
  import { userData } from "../../stores/user";
</script>

{#if $userData}
  <slot></slot>
{:else}
  <slot name="signed-out"></slot>
{/if}
