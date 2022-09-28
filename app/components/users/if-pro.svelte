<svelte:options tag="if-pro" />

<script lang="ts">
  import { userData } from '../../stores/user';
</script>

{#if $userData?.is_pro}
    <slot name="pro"></slot>
{/if}
{#if !$userData?.is_pro}
    <slot name="basic"></slot>
{/if}
{#if $userData?.pro_status === 'lifetime'}
    <slot name="lifetime"></slot>
{/if}
{#if $userData?.enterprise}
    <slot name="enterprise"></slot>
{/if}
{#if $userData?.pro_status === 'canceled'}
    <slot name="canceled"></slot>
{/if}