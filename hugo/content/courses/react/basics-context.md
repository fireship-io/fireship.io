---
title: Context
description: Working with the React Context API
weight: 10
lastmod: 2022-02-22T11:11:30-09:00
draft: false
vimeo: 683073665
emoji: 🌲
video_length: 1:25
---

## Example of Prop Drilling

{{< file "react" "App.js" >}}
```jsx
function PropDrilling() {

  const [count] = useState(0);

  return <Child count={count} />
}

function Child({ count }) {
  return <GrandChild count={count} />
}

function GrandChild({ count }) {
  return <div>{count}</div>
}
```

## Sharing Data with Context

{{< file "react" "App.js" >}}
```jsx
function PropDrilling() {

  const [count] = useState(0);

  return (
    <CountContext.Provider value={count}>
      <Child />
    </CountContext.Provider>
  )
}

function Child() {
  return <GrandChild />
}

function GrandChild() {

  const count = useContext(CountContext);

  return <div>{count}</div>
}
```
## Challenge

Create `CountContext` and `CountProvider` that uses `{ count, setCount }` as its values. This will allow the count and setCount function to be passed to any of its `{children}` in the tree.
Create 2 components `Count` and `CountButton` that can each call `useContext(CountContext)` to update the count and display the current count value.

<iframe class="frame-full" src="https://stackblitz.com/edit/react-4xm5fc?embed=1&file=src/App.js"></iframe>