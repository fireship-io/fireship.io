<svelte:options tag="hi-mom" />

<script lang="ts">
</script>

<modal-dialog name="himom" esc="true">
    <h1>Hi Mom!</h1>
    <img src="/img/himom.gif" alt="hi mom">
</modal-dialog>

<style>
    h1 {
        @apply text-pink-500 text-center text-7xl font-display font-normal;
    }
    img {
        @apply w-64 mx-auto;
    }
</style>
