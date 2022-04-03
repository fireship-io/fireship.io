---
title: Lifecycle and Effects
description: Working with the useEffect hook
weight: 9
lastmod: 2022-02-22T11:11:30-09:00
draft: false
vimeo: 683055338
emoji: 🌱
video_length: 1:35
---

## Lifecycle with Class Components

{{< file "react" "App.js" >}}
```jsx
class Lifecycle extends React.Component {
  
  componentDidMount() {
    // Initialize
  }

  componentDidUpdate() {
    // Updated
  }

  componentWillUnmount() {
    // Removed
  }
}

```

## Lifecycle with useEffect

{{< file "react" "App.js" >}}
```jsx
function Lifecycle() {

  const [count] = useState(0);

  useEffect(() => {
    
    console.log('count updated!')

    return () => console.log('destroyed!')

  }, [count]);

}
```

## Challenge

Implement a `CountdownTimer` component that implements `useState()` and `useEffect()` in conjunction with `setInterval` to handle the timer. Make sure you use the `useEffect()` hook to call `clearTimeout()` when the component is destroyed.

<iframe class="frame-full" src="https://stackblitz.com/edit/react-2j1xe5?embed=1&file=src/App.js"></iframe>