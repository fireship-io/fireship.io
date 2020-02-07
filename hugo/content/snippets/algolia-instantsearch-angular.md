---
title: Algolia Instantsearch with Angular
lastmod: 2019-08-25T13:07:30-07:00
publishdate: 2019-08-25T13:07:30-07:00
author: Jeff Delaney
draft: false
description: Algolia Instantsearch with Angular 8
tags: 
    - angular
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

## Install Instantsearch

Algolia provides official [Angular support](https://community.algolia.com/angular-instantsearch/). Follow the installation steps to make the prebuilt components available in your app. 

## Angular Instantsearch Component

{{< file "html" "search.component.html" >}}
{{< highlight html >}}
<ais-instantsearch
  [config]="{
    apiKey: 'YOUR-SEARCH-ONLY-KEY',
    appId: 'YOUR-APP-ID',
    indexName: 'customers',
    routing: true
  }">

<ais-search-box></ais-search-box>
  <ais-hits>
    <ng-template let-hits="hits" let-results="results">
        <div *ngIf="hits.length === 0">
            No results found matching <strong>{{results.query}}</strong>.
        </div>
              
        <div *ngIf="results.query">
            <div *ngFor="let hit of hits" class="content">
                <img [src]="hit.avatar">
                <section>
                    <h3>{{hit.username}} {{hit.objectID}}</h3>
                    <ais-highlight attribute="bio" [hit]="hit"></ais-highlight>
                </section>
            </div>
        </div>
      </ng-template>
  </ais-hits>

</ais-instantsearch>
{{< /highlight >}}