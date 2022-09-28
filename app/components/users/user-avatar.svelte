<svelte:options tag="user-avatar" />

<script lang="ts">
  import { userData, userProgress } from '../../stores/user';
</script>

<div class="wrap">
    <user-data field="photoURL" />
    {#if $userData?.pro_status === 'active'}
      <span class="label green" title="all access pass">PRO</span>
    {/if}
    {#if $userData?.pro_status === 'lifetime'}
        <span class="label green" title="you are a total chad">Lifer</span>
    {/if}
    {#if $userData?.pro_status === 'enterprise'}
        <span class="label blue" title="enterprise account">SUDO</span>
    {/if}
    {#if $userData?.pro_status === 'canceled'}
        <span class="label orange" title="thank you for being a former member">Vet</span>
    {/if}
    {#if !$userData?.pro_status}
        <span class="label gray" title="upgrade for all access">Basic</span>
    {/if}
    
</div>

<span class="xp" title="experience points">
    { $userProgress?.xp?.toLocaleString('en', { notation: 'compact' }) ?? 0 }
</span>

<style lang="scss">
    .wrap {
        @apply relative top-1 overflow-clip w-12;
    }

    .label {
        @apply absolute bottom-0 left-1/2 -translate-x-1/2 font-display text-center block mx-auto px-2 text-xs rounded-sm shadow-lg cursor-help;
        &.green { @apply bg-green-500;}
        &.gray { @apply bg-gray6;}
        // &.purple { @apply bg-purple-500;}
        &.blue { @apply bg-blue-500;}
        &.orange { @apply bg-orange-500;}
    }
    .xp {
        @apply absolute top-0 -right-8 text-green-500 text-sm p-1 font-bold min-w-[5ch] text-center cursor-help bg-black bg-opacity-50 rounded-full shadow-xl;
    }

</style>