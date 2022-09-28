---
title: Conditional Rendering
description: How to render a component based on a boolean condition
weight: 5
lastmod: 2022-02-22T11:11:30-09:00
draft: false
vimeo: 683055573
emoji: 🔀
video_length: 1:33
---

Conditional rendering is a very common pattern where you render a component based on a boolean condition. There are several ways to implement conditional rendering in React.

## Option 1: If Else

{{< file "react" "App.js" >}}
```jsx
function Conditional({ count }) {

  if (count > 5) {
    return <h1>Count is greater than 5</h1>;
  } else {
    return <h1>Count is less than 5</h1>;
  }
}
```

## Option 2: Ternary

{{< file "react" "App.js" >}}
```jsx
{count % 2 === 0 ? <h1>Count is even</h1> : <h1>Count is odd</h1> }
```

## Option 3: Logical And

{{< file "react" "App.js" >}}
```jsx
{count && 2 === 0 ? <h1>Count is even</h1> }
```

## Challenge

Define a *LoadingButton* component. The button takes loading state, onClick, and label as props then renders the label or loader depending on the loading state.

<iframe class="frame-full" src="https://stackblitz.com/edit/react-ksebra?embed=1&file=src/App.js"></iframe>