<svelte:options tag="img-reveal" />

<script lang="ts">
    export let src: string;
    let hovered = false;
    let imgPosition = 0;

    function leave() {
        hovered = false;
        imgPosition = 0;
    }

    function moveImg(e) {
        const containerRect = e.currentTarget.getBoundingClientRect();
        const imgWidth = e.currentTarget.querySelector('img').getBoundingClientRect().width;
        imgPosition = e.clientX - containerRect.left - imgWidth / 2;
    }

</script>

<span class="text" on:mouseenter={() => hovered = true} on:mouseleave={leave} on:mousemove={moveImg}>
    <slot></slot>
    {#if hovered}
        <img {src} alt="special effect" style={`transform: translateX(${imgPosition}px);`} />
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