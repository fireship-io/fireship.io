---
title: Game UI
description: Matching Game UI
weight: 31
lastmod: 2022-02-22T11:11:30-09:00
draft: false
vimeo: 689135206
emoji: 👾
video_length: 3:19
---

## App

{{< file "react" "App.js" >}}
```jsx
import { useState } from 'react';
import Card from './components/Card';
import shuffle from './utilities/shuffle';



function App() {
  const [cards, setCards] = useState(shuffle); // Cards array from assets

  return (
    <>

      <div className="grid">
        {cards.map((card) => {
          const { image, id, matched } = card;
          
          return (
            <Card
              key={id}
              image={image}
              selected={false}
              onClick={() => {}}
            />
          );
        })}
      </div>
    </>
  );
}

export default App;
```

## Card

{{< file "react" "Card.js" >}}
```jsx
const Card = ({ image, selected, onClick }) => {


  return (
    <div className="card">
      <div className={selected && 'selected'}>
        <img alt="" src={image} className="card-face" />

        <img
          alt=""
          className="card-back"
          src={'/assets/fireship.png'}
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export default Card;
```

## Shuffle

{{< file "js" "app.js" >}}
```javascript
// Combine and shuffle two arrays
const shuffle = () => {
  const assets = [
    { image: '/assets/css.png' },
    { image: '/assets/html5.png' },
    { image: '/assets/jquery.png'},
    { image: '/assets/js.png' },
    { image: '/assets/next.png' },
    { image: '/assets/node.png' },
    { image: '/assets/react.png'},
    { image: '/assets/ts.png' },
  ];
  return [...assets, ...assets]
    .sort(() => Math.random() - 0.5)
    .map((card) => ({ ...card, id: Math.random() }));
};

export default shuffle;
```

## Additional Learning

[CSS Grid in 100 Seconds](https://youtu.be/uuOXPWCh-6o)
[CSS Animation](https://youtu.be/HZHHBwzmJLk)