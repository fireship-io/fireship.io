---
title: Read
lastmod: 2019-04-16T09:12:30-08:00
draft: false
description: How to read individual documents. 
weight: 6
emoji: 🔥
vimeo: 330791488
free: true
video_length: 2:55
---

Use the helper function below to query an array of document IDs. This is especially useful when you have a many-to-many data model that references IDs from a separate collection. 

{{< file "js" "firestore.js" >}}
{{< highlight javascript >}}
// Helper: Reads an array of IDs from a collection concurrently
const readIds = async (collection, ids) => {
    const reads = ids.map(id => collection.doc(id).get() );
    const result = await Promise.all(reads);
    return result.map(v => v.data());
}
{{< /highlight >}}
