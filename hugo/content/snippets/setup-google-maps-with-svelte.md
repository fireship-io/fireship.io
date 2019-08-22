---
title: Setup Google Maps With Svelte 3
lastmod: 2019-08-22T13:31:18-07:00
publishdate: 2019-08-22T13:31:18-07:00
author: Jeff Delaney
draft: false
description: How to get started with Google Maps in Svelte 3
tags: 
    - google-maps
    - svelte

# youtube: 
code: https://github.com/fireship-io/svelte3-google-maps
type: lessons
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

The following guide will show you how to configure [Google Maps](https://developers.google.com/maps/documentation/javascript/tutorial) for [Svelte 3](https://svelte.dev/). 

## Enable the Google Maps JS API

{{< figure src="/img/snippets/google-maps-enable.png" caption="Enable the Google Maps JavaScript API from a GCP or Firebase project." >}}

## Detect when Google Maps is Ready

Google Maps will be loaded asynchronously and the script can notify us when it is ready by calling a callback function. In Svelte, we define an `initMap` callback on the window and use it to set the `ready` prop on the app so we can react within a svelte component. 

{{< file "js" "main.js" >}}
{{< highlight javascript >}}
import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		ready: false,
	}
});

window.initMap = function ready() {
	app.$set({ ready: true });
}

export default app;
{{< /highlight >}}

Before 

In the *App.component* we declare the script using `<svelte:head>` using the API key from the GCP console. The map component is conditionally loaded the Google Maps is ready. In addition, I recommend removing global padding if you want to build a fullscreen map. 

{{< file "svelte" "App.svelte" >}}
{{< highlight html >}}
<script>
	import Map from './Map.svelte';
	export let ready;
</script>

<svelte:head>
	<script defer async
	src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap">
	</script>
</svelte:head>

<style>
:global(body) {
	padding: 0;
}
</style>

{ #if ready }
<Map></Map>
{ /if }
{{< /highlight >}}


## Create the Map

Lastly, we create the map in its own *Map.svelte* component. We know that the Google Maps JS script is finished loading at this point, allowing us to create a new interactive map with the `onMount` lifecycle hook. The `container` prop is used to reference the DOM element the map will be mounted to. 

{{< file "svelte" "Map.svelte" >}}
{{< highlight html >}}
<script>
	let container;
	let map;
	let zoom = 8;
    let center = {lat: -34.397, lng: 150.644};
    
    import { onMount } from 'svelte';
    
	onMount(async () => {
		map = new google.maps.Map(container, {
            zoom,
            center,
		});
	});
</script>

<style>
.full-screen {
    width: 100vw;
    height: 100vh;
}
</style>

<div class="full-screen" bind:this={container}></div>
{{< /highlight >}}


{{< figure src="/img/snippets/svelte-google-maps.png" caption="Google Maps running in Svelte 3" >}}