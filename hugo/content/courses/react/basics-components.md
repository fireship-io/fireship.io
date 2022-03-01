---
title: Components
description: How does a component-based architecture for building UIs actually work?
weight: 4
lastmod: 2022-02-22T11:11:30-09:00
draft: false
vimeo: 681073928
emoji: 🗃️
video_length: 2:44
---

## React Dev Tools

React Components are reusable pieces of UI that developers compose together as a tree to represent a complete frontend application. Before writing any code, install the [React Dev Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) extension and go to a website like Facebook that uses react and inspect its code. 

## Define Components with JSX

Now in your code, define a component by declaring a JavaScript function. It can use the function keyword, or be a function expression if you prefer. It’s return value is the UI represented in a JavaScript friendly version of HTML called JSX. It typically starts with parentheses, followed by exactly one parent element, or an empty element called a fragment, followed by some HTML. But it’s no ordinary HTML - it can also run JavaScript allowing you to include dynamic values from your code using braces. Once a component is defined it can be declared or used in other parts of the UI similar to other HTML elements. 

{{< file "react" "app.jsx" >}}
```javascript
function MyComponent() {
  return <p>🔥 Hello!</p>;
}

<MyComponent />
```

## Share Data with Props

You can pass data into a component with props. Every functional component has a props argument that can accept external data. A prop can be a primitive value like a string or number, and object, or even another React component. Components can pass props from a parent to child, but not vice versa. This means that any state or data that changes is owned by one component, and can only be used by its children. This creates a one-way or unidirectional dataflow that keeps your code modular and predictable. 

{{< file "react" "app.jsx" >}}
```javascript
function MyComponent(props) {
  return <p>🔥 {props.name}</p>;
}

<MyComponent name="Jeff" />


// Or use desctruturing to pass props

function MyComponent({ name }) {
  return <p>🔥 {name}</p>;
}

// Use braces to pass an expression

<MyComponent name={`JeffD` + 23} />
```

## Virtual DOM and React Fiber

What makes React so powerful, is that when this data changes the library knows how to efficiently rerend any each component using an internal mechanism called the [Virtual DOM](https://reactjs.org/docs/faq-internals.html) and more recently React Fiber. You don’t need to know much about VDOM or Fiber to use React, but it is important to be aware that it’s the magic that reconciles your react code with the real DOM in the browser at runtime. It you want to go further down this rabbit hole, check out the official documentation.

## Challenge

Define a set of 2 components - *Card* and *Icon*. the card takes the icon as a prop, then renders custom HTML below it with `props.children`.

<iframe class="frame-full" src="https://stackblitz.com/edit/react-b7htyi?embed=1&file=src/App.js"></iframe>