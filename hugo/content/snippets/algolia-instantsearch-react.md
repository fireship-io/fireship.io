---
title: Algolia Instantsearch with React
lastmod: 2019-08-25T13:07:30-07:00
publishdate: 2019-08-25T13:07:30-07:00
author: Jeff Delaney
draft: false
description: Algolia InstantSearch with React
tags: 
    - react
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

## Install InstantSearch

Algolia provides official [React support](https://www.algolia.com/doc/guides/building-search-ui/installation/react/). Follow the installation steps to make the prebuilt components available in your app. 

## React InstantSearch Component

{{< file "react" "App.js" >}}
{{< highlight jsx >}}
import React from 'react';
import './App.css';

import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, connectHighlight } from 'react-instantsearch-dom';

const searchClient = algoliasearch('YOUR-APP-ID', 'YOUR-SEARCH-KEY');


function App() {
  
  return (
    <InstantSearch searchClient={searchClient} indexName="customers">
      <SearchBox />
      <Hits hitComponent={Hit} />
    </InstantSearch>
  )
}

const CustomHighlight = connectHighlight(({ highlight, attribute, hit }) => {
  const parsedHit = highlight({
    highlightProperty: '_highlightResult',
    attribute,
    hit
  });

  return (
    <div>
      <h3>{hit.username}</h3>
      <img src={hit.avatar} alt={hit.username} />
      {parsedHit.map(
        part => part.isHighlighted ? <mark>{part.value}</mark> : part.value
      )}
    </div>
  );
});

const Hit = ({ hit }) => (
  <p>
    <CustomHighlight attribute="bio" hit={hit} />
  </p>
);


export default App;
{{< /highlight >}}
