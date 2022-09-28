---
title: Intersection Observer for Lazy-Loaded Images
lastmod: 2019-01-25T05:48:23-07:00
publishdate: 2019-01-25T05:48:23-07:00
author: Jeff Delaney
draft: false
description: Use IntersectionObserver to lazy load images without listening to scroll events. 
tags: 
    - javascript
type: lessons
youtube: aUjBvuUdkhg
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

[IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) is a browser API that allows you to detect when an element is visible in the window or within a scrollable element. [Browser support](https://caniuse.com/#feat=intersectionobserver) is pretty decent with Safari being the main holdout at the time of this article, but there is a [polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) to support Apple users. 

**Packages using IntersectionObserver:** 

- [QuickLink](https://github.com/GoogleChromeLabs/quicklink) - Adds a preload tag to visible links on the page. 
- [Vanilla Lazy Load](https://www.npmjs.com/package/vanilla-lazyload) - Lazy loaded images. 
- Fireship.io - We use it to lazily load the comments at the bottom of the page. 

Do not try to perform long-running or cpu intensive task in the observer's event handler. It runs on the main thread and may block other important tasks in the event loop. 

## Lazy Loaded Images 

Let's imagine we have some images in an HTML document. Rather than define a `src` attribute (this will cause the browser to load the image immediately), let's set a custom data attribute.  We will read the `data-lazy` attribute when it becomes visible in the viewport, then use JavaScript to set the src. 

{{< file "html" "index.html" >}}
```html

<!-- regular image -->
<img src="img/pig.jpeg">

<!-- our lazy image -->
<img data-lazy="img/cow.jpeg">
```

### Scroll Version

The code below works, but it does not scale well on a page with many images. Scrolling fires off many events and the browser will need to recalculate every element in the DOM each time. This is very inefficient and will cause jank, especially on mobile and/or pages with iframes. 

{{< file "js" "bad.js" >}}
```js
// 💩 Scroll Listener 

const targets = document.querySelectorAll('img');

window.addEventListener('scroll', (event) => {
    targets.forEach(img => {
        console.log('💩')
        const rect = img.getBoundingClientRect().top;
        if (rect <= window.innerHeight) {
            const src = img.getAttribute('data-lazy');
            img.setAttribute('src', src);
            img.classList.add('fade');
        }
    })
})
```


### IntersectionObserver Version

The code below does not need to send an event on every scroll change. In addition, we do not need to perform any calculations because the `isIntersecting` value tells us whether or not the image is visible. Once the image is visible we can disconnect the observer to further optimize efficiency. 

{{< file "js" "good.js" >}}
```js
const targets = document.querySelectorAll('img');

const lazyLoad = target => {
  const io = new IntersectionObserver((entries, observer) => {
    console.log(entries)
    entries.forEach(entry => {
      console.log('😍');

      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-lazy');

        img.setAttribute('src', src);
        img.classList.add('fade');

        observer.disconnect();
      }
    });
  });

  io.observe(target)
};

targets.forEach(lazyLoad);
```
