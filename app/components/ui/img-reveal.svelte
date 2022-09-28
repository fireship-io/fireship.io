<svelte:options tag="img-reveal" />

<script lang="ts">
    export let src: string;
    let hovered = false;
    let offset = 0;

    function leave() {
        hovered = false
        offset = 0
    }

    function moveImg(e) {
        offset += e.movementX;
    }
</script>

<span class="text" on:mouseenter={() => hovered = true} on:mouseleave={leave} on:mousemove={moveImg}>
    <slot></slot>
    {#if hovered}
        <img {src} alt="special effect" style={`transform: translateX(${offset || 0}px);`} />
    {/if}
</span>



<style lang="scss">
    .text {
        @apply relative;
    }
    img {
        @apply absolute bottom-1/2 w-52 right-0;
    }
</style>