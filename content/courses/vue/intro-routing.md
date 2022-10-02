---
title: Your First Component
description: Build a basic home page component with routing
weight: 13
lastmod: 2020-04-01T10:23:30-09:00
draft: false
vimeo: 403196386
emoji: 🚆
free: true
video_length: 2:13
---

## Install the Vue Router

[Routing Docs](https://router.vuejs.org/)

{{< file "terminal" "command line" >}}
```text
npm install vue-router
```

## Configure a Basic Route 

{{< file "js" "main.js" >}}
```javascript
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Home from './components/Home'

const router = new VueRouter({
  routes: [
    { path: '/', component: Home },
  ]
})

new Vue({
  router, 
  render: h => h(App),
}).$mount('#app')
```

## Create the Home Page

{{< file "vue" "App.vue" >}}
```html
<template>
  <div class="section">
    <h2>Home.vue</h2>
  </div>
</template>
```