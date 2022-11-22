---
title: Least Recently Used (LRU) Cache
description: How to implement an LRU cache in JavaScript
weight: 32
lastmod: 2022-11-11T10:23:30-09:00
draft: false
vimeo: 773492873
emoji: 🧺
video_length: 4:01
quiz: true
---

<quiz-modal options="faster lookup:easier to delete keys:use any key type:ordered keys" answer="ordered keys" prize="9">
  <h6>Which feature makes a JS Map suitable for an LRU cache?</h6>
</quiz-modal>

The [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU) cache is one of the most commoly asked algorithm questions on interviews. 

## LRU Interview Question

Create a data structure that implements the requirements of a Least Recently Used (LRU) cache with O(1) average time complexity.


- Initialize an object with a maxium capacity of elements.
- `getItem` Return the value of the key. Update cache with the most recently used key. 
- `putItem` Create or update a key value pair in the cache. Evict the least recently used key if the size of keys exceeds the max capacity.

## LRU Implementation in JavaScript

```js
export class LRU {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  getItem(key) {
    const item = this.cache.get(key);

    // Map keeps track of insertion order, this will refresh the item
    if (item) {
      this.cache.delete(key);
      this.cache.set(key, item);
    }
    return item;
  }

  putItem(key, val) {
    // delete to refresh the insertion order
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // evict the oldest item in the cache
    else if (this.cache.size == this.capacity) {
      this.cache.delete(this.oldestItem);
    }

    this.cache.set(key, val);
  }

  get oldestItem() {
    return this.cache.keys().next().value;
  }
}

const cache = new LRU(5);
cache.putItem('a', 1);
cache.getItem('a');
```

