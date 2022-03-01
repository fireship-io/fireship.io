---
title: Loops
description: How to render a collection of items in JSX
weight: 6
lastmod: 2022-02-22T11:11:30-09:00
draft: false
vimeo: 683055515
emoji: ➰
video_length: 1:40
---

## Array Map

The most common way to loop over a collection of data in React is to use the Array `map` method. It takes a callback function that gets called on each element to transform the data into UI elements.

{{< file "react" "App.js" >}}
```jsx
function ListOfAnimals() {

  const data = [
    { id: 1, name: 'Fido 🐕' }, 
    { id: 2, name: 'Snowball 🐈' }
  ];

  return (
    <ul>
      {data.map(({ id, name }) => 
        
        <li key={id}>{name}</li> 

      )}
    </ul>
  );

}
```