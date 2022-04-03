---
title: State
description: Working with the useState hook
weight: 8
lastmod: 2022-02-22T11:11:30-09:00
draft: false
vimeo: 683055390
emoji: 🔄
video_length: 1:46
---

## Basic Usage

{{< file "react" "App.js" >}}
```jsx
function Stateful() {

  const [count, setCount] = useState(0);
  const [prevCount, setPrevCount] = useState(0);

  const handleClick = () => {
    setCount((prev) => {
      setPrevCount(prev);
      setCount(count + 1);
    });
  };

  return (
    <>
      <h3>Current count: {count}</h3>
      <h3>Previous count: {prevCount}</h3>
      <button onClick={handleClick}>Increment</button>
    </>
  );
}
```

## Updating Objects with useState

{{< file "react" "App.js" >}}
```jsx
function Stateful() {
  const [state, setState] = useState({ count: 0, user: 'Bob' });

  const handleClick = () => {
    setState({
      ...state,
      count: state.count + 1,
    });
  };

  return (
    <>
      <h3>Count: {state.count}</h3>
      <h3>User: {state.user}</h3>
      <button onClick={handleClick}>Increment</button>
    </>
  );
}
```

## Challenge

Implement a `handleClick()` function to handle state using `useState()`.

<iframe class="frame-full" src="https://stackblitz.com/edit/react-zu9llg?embed=1&file=src/App.js"></iframe>