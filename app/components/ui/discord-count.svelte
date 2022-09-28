<svelte:options tag="discord-count" />

<script lang="ts">
    import { onMount } from "svelte";

    let data;

    onMount(async () => {
        let res = await fetch('https://discord.com/api/guilds/1015095797689360444/widget.json');
        data = await res.json();
    })


</script>

{#if data}
        <span class="ping">
            <span class="outer"></span>
            <span class="inner"></span>
        </span>
        <span class="num">{data.presence_count}</span> members online
{/if}

<style lang="scss">
    .ping {
        @apply inline-flex h-3 w-3 relative;
    }
    .outer {
        @apply animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75;
    }
    .inner {
        @apply relative inline-flex rounded-full h-3 w-3 bg-green-500;
    }
    .num {
        @apply text-green-500 font-display text-lg;
    }
</style>