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