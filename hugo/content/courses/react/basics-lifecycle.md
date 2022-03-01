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