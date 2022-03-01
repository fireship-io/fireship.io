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

  return (
    <>
      <p>{count}</p>

      <button onClick={() => setCount(count + 1)}>+</button>
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
      <p>{state.count}</p>

      <button onClick={handleClick}>+</button>
    </>
  );
}
```