---
title: Algolia Search with Svelte
lastmod: 2019-08-25T13:07:30-07:00
publishdate: 2019-08-25T13:07:30-07:00
author: Jeff Delaney
draft: false
description: Algolia InstantSearch with Svelte 3
tags: 
    - svelte
    - algolia

youtube: 
github: https://github.com/fireship-io/203-algolia-firestore-mvp
type: lessons
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

{{< box emoji="👀" >}}
This tutorial is an extension of the [Algolia Cloud Functions Guide](/lessons/algolia-cloud-functions/). You must have the Cloud Functions deployed to start making instant search queries from your frontend app. 
{{< /box >}}

## Install Algolia 

Algolia does not provide official support for [Svelte](https://svelte.dev), but we can easily implement our own custom UI with [AlgoliaSearch](https://github.com/algolia/algoliasearch-client-javascript). 

Note. You can also use InstantSearch.js if you want pre-built components.

{{< file "terminal" "command line" >}}
{{< highlight text >}}
npm install algoliasearch
{{< /highlight >}}

## Update the index.html

The Algolia client makes a reference to `process`, which does not exist in the browser. Add the code below to prevent errors. 

{{< file "html" "public/index.html" >}}
{{< highlight html >}}
	<title>Svelte app</title>

	<!-- ADD THIS LINE -->
	<script>window.process = {env: { DEBUG: undefined } }</script>
{{< /highlight >}}

## Svelte Algolia Search Component

The component below initializes the AlgoliaSearch *lite*, then binds a request to each *keyup* event on a form input. Algolia returns an object with the resulting hits, which are updated on the component's `hit` property. 

{{< file "svelte" "Search.svelte" >}}
{{< highlight html >}}
<script>
import { onMount } from 'svelte';
import algoliasearch from 'algoliasearch/lite';

let searchClient;
let index;

let query = '';
let hits = [];

onMount(() => {

	searchClient = algoliasearch(
		'YOUR-APP-ID',
		'YOUR-SEARCH-ONLY-KEY'
	);

	index = searchClient.initIndex('customers');

	// Warm up search
	index.search({ query }).then(console.log)

});

// Fires on each keyup in form
async function search() {
	const result = await index.search({ query });
	hits = result.hits;
	console.log(hits)
}


</script>

<style>
	:global(em) {
		color: red;
		font-weight: bold;
		background: black;
	}
</style>


<h1>Svelte InstantSearch</h1>

<div>
	<input type="text" bind:value={query} on:keyup={search}>
</div>


{#each hits as hit}
	<img src={hit.avatar} alt={hit.username}>
	<section>
		<h3>{hit.username} {hit.objectID}</h3>
		<!-- <p>{hit.bio}</p> -->

		<p contenteditable bind:innerHTML={hit._highlightResult.bio.value}></p>
	</section>
{/each}
{{< /highlight >}}

{{< figure src="/img/snippets/svelte-algolia.png" caption="Demo of Algolia Search in Svelte 3" >}}