---
title: Svelte for React Developers
lastmod: 2023-06-28T09:37:39-07:00
publishdate: 2023-06-28T09:37:39-07:00
author: Jeff Delaney
draft: false
description: 10 examples of how React.js patterns look in Svelte 
tags: 
    - svelte
    - react

youtube: MnpuK0MK4yo
---

## 1. Component State

In react, we have the `useState` hook, while in Svelte any value with `let` is reactive. 

### React

{{< file "react" "App.js" >}}
```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
        count is {count}
    </button>
  );
}

export default Counter;
```


### Svelte 

{{< file "svelte" "App.svelte" >}}
```svelte
<script>
  let count = 0;
</script>

<button on:click={() => count++}>
  count is {count}
</button>
```

## 2. Props

### React

Passing props looks nearly identical in both frameworks:

```jsx
<ColorPicker color={"red"}>
    <p>Some child elements</p>
</ColorPicker>
```

In React, props are created passed via function arguments. In Svelte, props are created with the `export` keyword. 

{{< file "react" "App.js" >}}
```jsx

function ColoredBox({ color }) {
  return (
     <p>You picked the color: {color}</p>
  );
}
```


### Svelte 

{{< file "svelte" "App.svelte" >}}
```svelte
<script>
  export let color;
</script>

You picked the color: {color}
```

## 3. Children

### React


{{< file "react" "App.js" >}}
```jsx
function Navbar(props) {
  return (
     <nav>
        {props.children}
     </nav>
  );
}
```


### Svelte 

{{< file "svelte" "App.svelte" >}}
```svelte
<slot />
```

## 4. Initialization Logic

### React


{{< file "react" "App.js" >}}
```jsx
function Navbar() {
    useEffect(() => {
        const fun = async () => {
            // handle promise
        }
        fun();
    }, []);
}
```


### Svelte 

{{< file "svelte" "App.svelte" >}}
```svelte
<script>
  onMount(async () => {
    // handle promise
  });
</script>
```

## 5. Side-effects & Computed State

### React


{{< file "react" "App.js" >}}
```jsx
import { useEffect, useMemo, useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  const doubled = useMemo(() => count * 2, [count]);

  useEffect(() => {
    document.title = `count is ${count}`;
  }, [count]);

}
```


### Svelte 

{{< file "svelte" "App.svelte" >}}
```svelte
<script>
  let count;

  $: doubled = count * 2 
  $: document.title = `count is ${count}`
</script>
```

## 6. Forms

### React

{{< file "react" "App.js" >}}
```jsx
function FormComponent() {
  const [firstName, setFirstName] = useState("jeff");

  const handleChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <h1>{firstName}</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleChange} />
      </form>
    </>
  );
}
```


### Svelte 

{{< file "svelte" "App.svelte" >}}
```svelte
<script>
  let firstName = "jeff";
  function handleSubmit(e) {}
</script>

<h1>{firstName}</h1>

<form on:submit|preventDefault={handleSubmit}>
  <input bind:value={firstName} />
</form>

```

## 7. Conditional Logic

### React


{{< file "react" "App.js" >}}
```jsx
{doubled > 1000 ? (
    <p>big</p>
    ) : doubled > 500 ? (
    <p>medium</p>
    ) : (
    <p>small</p>
)}
```


### Svelte 

{{< file "svelte" "App.svelte" >}}
```svelte
{#if doubled > 1000}
  <p>big</p>
{:else if doubled > 500}
  <p>medium</p>
{:else}
  <p>small</p>
{/if}
```

## 8. Keyed Loops

### React
{{< file "react" "App.js" >}}
```jsx
{items.map((item) => (
    <div key={item.id}>{item.name}</div>
))}
```


### Svelte 

{{< file "svelte" "App.svelte" >}}
```svelte
{#each items as item (item.id)}
  <p>{item.name}</p>
{/each}
```

## 9. Shared State

React does not have a built-in mechanism for shared state, but libraries like [Jotai](https://jotai.org/) provide a nice primitive. Svelte provides a built-in store API that is very similar to Observables in RxJS. 

### React

{{< file "js" "atom.js" >}}
```javascript
import { atom } from 'jotai'

export const countAtom = atom(0)
```

{{< file "react" "App.js" >}}
```jsx
import { useAtom } from "jotai";
import { countAtom } from "./atom";

function Counter() {

  const [count, setCount] = useAtom(countAtom) // useAtomValue to optimize re-renders

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>
        count is {count}
      </button>
    </>
  );
}
```

### Svelte 

{{< file "js" "store.js" >}}
```javascript
import { writable } from "svelte/store";

export const countStore = writable(0);
```

{{< file "svelte" "App.svelte" >}}
```svelte
<script>
  import { countStore } from "./store";
</script>

<button on:click={() => countStore.update(c => c + 1)}>
  count is {$countStore}
</button>
```
## 10. Unwrapping Promises

In the future, React will have a `use` hook that can unwrap promises, but it's currently experimental.

### React

{{< file "react" "App.js" >}}
```jsx
function ComponentWithAsyncData() {

  const number = use( Promise.resolve(69) );

  return (
    <p>{number}</p>
  );
}

function App() {
    return (
        <ErrorBoundary fallback={<ErrorPage />}>
            <Suspense fallback={<LoadingSpinner />}>
                <ComponentWithAsyncData />
            </Suspense>
        </ErrorBoundary>
    )
}
```

### Svelte


{{< file "svelte" "App.svelte" >}}
```svelte
<script>
    const promise = Promise.resolve(69);
</script>

{#await promise}
  <LoadingSpinner />
{:then number}
  <p>The number is {number}</p>
{:catch error}
  <ErrorPage />
{/await}
```

## 11. SSR

In Next.js, SSR and data fetching can be accomplished with React Server Components, while SvelteKit uses a dedicated `load` function.

### Next.js

{{< file "react" "page.js" >}}
```jsx
export default async function Users() {

  const item = await prisma.items.findOne();

  return (
    <p>{item.title}</p>
  );
}
```

### SvelteKit 

{{< file "js" "+page.ts" >}}
```javascript
export const load = (async () => {

      const item = await prisma.items.findOne();

      return {
        item
      };

}) satisfies PageLoad;
```

{{< file "svelte" "+page.svelte" >}}
```svelte
<script lang="ts">
    import type { PageData } from "./$types";
    export let data: PageData;
</script>

<p>{data.item.title}</p>
```