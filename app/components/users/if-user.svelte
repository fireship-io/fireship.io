<svelte:options tag="if-user" />



<script lang="ts">
  import { user } from '../../stores/user';
</script>

{#if $user}
    <slot></slot>
{:else}
    <slot name="signed-out"></slot>
{/if}
 