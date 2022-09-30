<svelte:options tag="algolia-search" />

<script lang="ts">
  import algolia from 'algoliasearch/lite';
  import { modal } from '../../stores/modal';
  import { router } from '../../main';
  import { onMount } from 'svelte';

  const APP_ID = '05VYZFXKNM';
  const API_KEY = 'a0837b31f4379765240c2753fa141aa2';
  const client = algolia(APP_ID, API_KEY);
  const index = client.initIndex('content');

  let results: any;
  let hits = [];
  let activeHit = 0;
  onMount(() => {
    return () => {
      window.removeEventListener('keydown', handleSpecialKeys);
    };
  });

  async function search(e: Event) {
    const q = (e.target as HTMLInputElement).value;
    results = await index.search(q, {
      hitsPerPage: 7,
      attributesToSnippet: ['summary'],
      highlightPreTag: '<mark class="high">',
      highlightPostTag: '</mark>',
    });
    hits = results.hits;
    activeHit = 0;
  }

  function goUp() {
    activeHit = activeHit <= 0 ? activeHit : activeHit - 1;
  }
  function goDown() {
    activeHit = activeHit >= hits.length - 1 ? activeHit : activeHit + 1;
  }
  function selectHit() {
    if (hits[activeHit]) {
      const url = hits[activeHit].relpermalink;
      router.go(url);
      modal.set(null);
    }
  }
  function handleSpecialKeys(e: KeyboardEvent) {
    if (e.key === 'ArrowUp') {
      goUp();
    }
    if (e.key === 'ArrowDown') {
      goDown();
    }
    if (e.key === 'Enter') {
      selectHit();
    }
  }
</script>

<svelte:window on:keydown={handleSpecialKeys} />

<modal-dialog name="search">
  <form>
    {#if $modal === 'search'}
      <input
        class="input"
        name="search"
        type="text"
        autofocus
        placeholder="Search"
        on:input={search}
      />
    {/if}
  </form>

  <div class="results">
    {#if !results?.nbHits}
      <p class="no-results">No results yet</p>
    {/if}
    {#each hits as hit, i}
      <a
        class="hit"
        href={hit.relpermalink}
        class:active={i === activeHit}
        on:mouseover={() => (activeHit = i)}
        on:focus={() => (activeHit = i)}
      >
        <span class="hit-title">{hit.title}</span>
        <span class="hit-type"> in {hit.type}</span>
        <span class="hit-description"
          >{@html hit._snippetResult.summary.value}</span
        >
      </a>
    {/each}
  </div>

  <footer>
    <kbd on:click={selectHit}>↩</kbd> <span class="kbd-text">select</span>
    <kbd on:click={goUp}>↑</kbd>
    <kbd on:click={goDown}>↓</kbd> <span class="kbd-text">navigate</span>
    <kbd on:click={() => modal.set(null)}>esc</kbd>
    <span class="kbd-text">leave</span>
  </footer>
</modal-dialog>

<style lang="scss">
  a,
  a:hover,
  a:focus,
  a:active {
    text-decoration: none;
    color: inherit;
  }
  form {
    @apply overflow-hidden;
  }
  .input {
    @apply bg-gray7 bg-opacity-50 text-white w-full md:w-[768px] font-sans text-xl rounded-none block p-3 
             border-4 border-solid border-t-0 border-r-0 border-l-0 border-b-purple-500 outline-none focus-visible:outline-none mr-2;
  }
  .results {
    @apply max-w-full min-h-[200px];
  }
  .hit {
    @apply block no-underline font-sans p-4 my-2 border bg-gray7 bg-opacity-50 shadow-md transition-all;
  }
  .hit-description {
    @apply text-gray3 text-sm block;
  }
  .hit-title {
    @apply text-lg font-bold;
  }
  .hit-type {
    @apply text-white font-light;
  }
  .no-results {
    @apply text-gray3 text-sm text-center;
  }

  .active {
    @apply bg-orange-500 text-white;
    .hit-description {
      @apply text-white;
    }
  }
  footer {
    @apply text-xs text-gray3 mt-6;
  }
  kbd {
    @apply text-gray3 cursor-pointer text-xs bg-transparent border border-solid rounded-md 
           border-orange-500 bg-opacity-50 p-1.5 hover:bg-orange-500 hover:text-white transition-all;
  }
  .kbd-text {
    @apply mr-3;
  }
</style>
