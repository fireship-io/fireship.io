
<svelte:options tag="complete-icon" />

<script lang="ts">
 import { canAccess, userProgress } from "../../stores";


  export let route: string;
  export let free: boolean;
</script>

{#if !free && !$canAccess}
    <span class="wrap">
        <!-- lock -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" class="purple"><path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/></svg>
    </span>
{/if}


{#if free || $canAccess}
    {#if $userProgress?.[route]}
        <span class="wrap">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="green" width="18" height="18">
                <path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM371.8 211.8C382.7 200.9 382.7 183.1 371.8 172.2C360.9 161.3 343.1 161.3 332.2 172.2L224 280.4L179.8 236.2C168.9 225.3 151.1 225.3 140.2 236.2C129.3 247.1 129.3 264.9 140.2 275.8L204.2 339.8C215.1 350.7 232.9 350.7 243.8 339.8L371.8 211.8z"/>
            </svg>
        </span>

    {:else}

        <span class="wrap">
            <svg viewBox="0 0 512 512" width="18" height="18" class="gray">
                <path d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"/>
            </svg>
        </span>
    {/if}
{/if}


<style lang="scss">
    svg { @apply mr-2 mt-1; }
    .wrap {
        @apply my-auto mr-0;
    }
    .gray {
        @apply  fill-gray5;
    }
    .green {
        @apply fill-green-500;
    }
    .purple {
        @apply fill-purple-500;
    }
</style>