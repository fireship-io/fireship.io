---
title: Redux
description: Redux Pattern for State Management
weight: 19.1
lastmod: 2022-02-22T11:11:30-09:00
draft: false
vimeo: 
emoji: ⚛️
video_length: 2:33
youtube: _shA5Xwe8_4
---

# Redux in React
- A single source of truth for all your data in your Javasript appliation

## Installation
```bash
npm install @reduxjs/toolkit

npm install react-redux
```
# How Redux Works
1. Basically you make a **Store** to keep your data in a centralized place
2. Call the **Provider Api** in the root of your application to make the store available for all your application
3. Use the **useSelector Hook** to retrieve the desired data
4. **useDisptatch** for initiating the actions and updating the states in the store
---

# 1. Create a Store

1.Make a store.ts/js file 

```jsx

const store = configureStore({
  reducer: {},
});

```
# 2. API Overview

```jsx

import React from 'react'
import ReactDOM from 'react-dom/client'

import { Provider } from 'react-redux'
import store from './store'

import App from './App'

// As of React 18
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
)

```

# 3. Hooks
- React Redux provides a pair of custom React hooks that allow your React components to interact with the Redux store.
- useSelector reads a value from the store state and subscribes to updates, while useDispatch returns the store's dispatch method to let you dispatch actions.

```jsx

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  selectCount,
} from './counterSlice'
import styles from './Counter.module.css'

export function Counter() {
  const count = useSelector(selectCount)
  const dispatch = useDispatch()

  return (
    <div>
      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
        <span className={styles.value}>{count}</span>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
      </div>
      {/* omit additional rendering output here */}
    </div>
  )
}

```








