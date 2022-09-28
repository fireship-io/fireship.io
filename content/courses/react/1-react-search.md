---
title: Search Frontend
description: Make requests to the server and show the results
weight: 22
lastmod: 2022-02-22T11:11:30-09:00
draft: false
vimeo: 685880696
emoji: 🦄
video_length: 5:07
---

## Additional Learning

[React Hooks Tutorial](https://youtu.be/TNhaISOUy6Q)


## Complete Code

{{< file "react" "App.js" >}}
```jsx
import { useEffect, useState } from 'react';

function App() {
  const { search, animals } = useAnimalSearch();

  return (
    <main>
      <h1>Animal Farm</h1>

      <input
        type="text"
        placeholder="Search"
        onChange={(e) => search(e.target.value)}
      />

      <ul>
        {animals.map((animal) => (
          <Animal key={animal.id} {...animal} />
        ))}

        {animals.length === 0 && 'No animals found'}
      </ul>
    </main>
  );
}

// Dumb UI component
function Animal({ type, name, age }) {
  return (
    <li>
      <strong>{type}</strong> {name} ({age} years old)
    </li>
  );
}

// Custom Hook
function useAnimalSearch() {
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    const lastQuery = localStorage.getItem('lastQuery');
    search(lastQuery);
  }, []);

  const search = async (q) => {
    const response = await fetch(
      'http://localhost:8080?' + new URLSearchParams({ q })
    );
    const data = await response.json();
    setAnimals(data);

    localStorage.setItem('lastQuery', q);
  };

  return { search, animals };
}

export default App;
```