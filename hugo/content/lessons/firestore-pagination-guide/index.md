---
title: Firestore Pagination - Go Forward and Backward
lastmod: 2019-11-18T09:17:06-07:00
publishdate: 2019-11-18T09:17:06-07:00
author: Jeff Delaney
draft: false
description: Pagination queries with Firestore that move forward and backward.
tags: 
    - javascript
    - firestore

type: lessons
youtube: 
code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

versions: 
    - firebase: 7.3.0
---

Pagination is the process of dividing your data into discrete pages. The official docs explain [basic pagination queries](https://cloud.google.com/firestore/docs/query-data/query-cursors), but this guide will go beyond the basics with a fully-functional implementation. 

{{% box icon="scroll" class="box-orange" %}}
Pagination is a tricky task when working with realtime data. If the position of data changes midway through a query, you might see results jump around the screen, which may confuse users. Pagination is most well suited for collections where the expected query ordering does not change frequently.
{{% /box %}}

## Firestore Pagination Implementation

The following guide will uses Svelte to simplify the frontend UI, but the underlying principles apply to all frontend frameworks. 

### Step 1 - Make the Initial Query

### Step 2 - Move Forward

### Step 3 - Move Backward

## Step 4 - Show a list of pages. 

Showing a list of pages requires us to know the total number of documents in the query. We cannot simply request the count from Firestore without reading the entire collection, but there are two strategies we can use/ 

### Option 1 - Increment a Counter

Option 1 can be handled entirely from the frontend code. 



### Option 2 - Aggregate data in a Cloud Function. 