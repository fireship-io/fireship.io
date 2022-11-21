---
title: Spread
description: Use the spread syntax to combine objects  
weight: 22
lastmod: 2022-11-11T10:23:30-09:00
draft: false
vimeo: 599073569
emoji: 👫
video_length: 2:05
quiz: true
---

<quiz-modal options="1:4:null" answer="1" prize="3">
  <h6>What is the value of property foo below?</h6>
<pre>
const obj = { 
    foo: 1, 
    bar: 2, 
    baz: 3 
};
const newObj = {
    foo: 4
    ...obj,
};
</pre>
</quiz-modal>