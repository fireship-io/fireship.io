---
title: Deck.gl Google Maps Tutorial
lastmod: 2019-10-29T07:53:34-07:00
publishdate: 2019-10-29T07:53:34-07:00
author: Jeff Delaney
draft: true
description: Create high-performance WebGL-powered data visualizations with Google Maps and deck.gl
tags: 
    - javascript
    - deckgl
    - google-maps

youtube: 
github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

## Step 1: Initial Setup

### Add Google Maps.js

First, [install Google Maps](https://fireship.io/snippets/setup-google-maps-with-svelte/) in your JavaScript project. 

### Install Deck.gl

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
npm i @deck.gl/{core,google-maps,layers,aggregation-layers}
{{< /highlight >}}


Customize color palettes with [Color Brewer](http://colorbrewer2.org)
