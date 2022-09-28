

<svelte:options tag="user-data" />

<script lang="ts">
  import { courseByLegacySku } from '../../stores/products';
  import { user, userData, userProgress } from '../../stores/user';
  export let field: | 'email' | 'photoURL' | 'displayName' | 'uid' | 'xp' | 'xp-raw' | 'status' | 'expires' | 'courses';

  function formatXp(num: number) {
    let formatter = Intl.NumberFormat('en', { notation: 'compact' });
    return formatter.format(num)
  }

  let src = $user?.photoURL ?? '/img/ui/avatar.svg';

  function relativeTime(date: number) { 
    if (!date) return 'never';
    let fmt = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    let diff = -Math.floor((Date.now() - (date * 1000)) / 1000) / 86400;
    return fmt.format(Math.floor(diff), 'day');
  }

  // Don't even try to understand this code. It's needed to make sure legacy courses are shown. 
  $: purchasedCourses = [...Object.keys($userData?.courses || {}), ...Object.keys($userData?.products || {}).map(courseByLegacySku)].filter(Boolean) 
</script>

{#if field === 'email' }
    { $user?.email }
{/if}
{#if field === 'photoURL' }
    <img {src} alt="avatar" referrerpolicy="no-referrer" style="max-width: 100%; border-radius: 9999px;" on:error={() => src = '/img/ui/avatar.svg'}>
{/if}
{#if field === 'displayName' }
    { $user?.displayName }
{/if}
{#if field === 'uid' }
    { $user?.uid }
{/if}
{#if field === 'xp' }
    {formatXp($userProgress?.xp ?? 0)}
{/if}
{#if field === 'xp-raw' }
    {$userProgress?.xp?.toLocaleString() ?? 0}
{/if}
{#if field === 'expires' }
    {#if $userData?.expires}
        Your PRO access expires {relativeTime($userData?.expires)}
    {/if}
{/if}

{#if field === 'courses'}
    {#if purchasedCourses?.length}
        <h3>Purchased Courses</h3>
        <ul>
            {#each purchasedCourses as course}
                <li><a href={`/courses/${course}`}>{course}</a></li>
            {/each}
        </ul>
    {/if}
    
{/if}
{#if field === 'status' }
    <span class={$userData?.pro_status ?? 'basic'}>{$userData?.pro_status ?? 'basic'}</span>
{/if}

<style>
    h3 {
        @apply font-display text-white font-normal;
    }
    a {
        @apply text-blue-500 no-underline;
    }
    ul {
        @apply mb-10;
    }
    .basic {
        @apply text-gray4;
    }
    .active {
        @apply text-green-500;
    }
    .cancelled {
        @apply text-yellow-500;
    }
    .enterprise {
        @apply text-blue-500;
    }
    .lifetime {
        @apply text-green-500;
    }

</style>

