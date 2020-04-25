---
title: Graph Traversal
lastmod: 2020-02-18T09:12:30-08:00
draft: false
description: Graph Traversal with breadth-first (BFS) and depth-first Search (DFS)
weight: 30
emoji: 🌳
free: true
featured_img: courses/javascript/img/graph-featured.png
chapter_start: JS Interview Prep
---

{{< youtube cWNEl4HE2OE >}}

## Graph Representation as Adjacency List

A graph can be represented as an adjacency matrix or adjacency list. In most cases, it is more efficient to use the latter because it requires less memory and offers better time-complexity when performing search algorithms. 

Imagine we have a dataset that contains airports and routes. We can represent the graph as a `Map` where each key (node) is an airport and the value (edges) is an array airports that it can connect to. 

{{< file "js" "graph.js" >}}
```javascript
// DATA
const airports = 'PHX BKK OKC JFK LAX MEX EZE HEL LOS LAP LIM'.split(' ');

const routes = [
    ['PHX', 'LAX'],
    ['PHX', 'JFK'],
    ['JFK', 'OKC'],
    ['JFK', 'HEL'],
    ['JFK', 'LOS'],
    ['MEX', 'LAX'],
    ['MEX', 'BKK'],
    ['MEX', 'LIM'],
    ['MEX', 'EZE'],
    ['LIM', 'BKK'],
];


// The graph
const adjacencyList = new Map();

// Add node
function addNode(airport) {
    adjacencyList.set(airport, []);
}

// Add edge, undirected
function addEdge(origin, destination) {
    adjacencyList.get(origin).push(destination);
    adjacencyList.get(destination).push(origin);
}

// Create the Graph
airports.forEach(addNode);
routes.forEach(route => addEdge(...route))
```

Now that we have our graph represented in JavaScript, let's try to determine if a route exists between PHX and BKK. 

## Breadth-first Search (BFS)

Breadth-first Search (BFS) starts by pushing all of the direct children to a queue (first-in, first-out). It then visits each item in queue and adds the next layer of children to the back of the queue. This example uses a `Set` to keep track of nodes that have already been visited. 

```javascript

function bfs(start) {

    const visited = new Set();

    const queue = [start]


    while (queue.length > 0) {

        const airport = queue.shift(); // mutates the queue

        const destinations = adjacencyList.get(airport);


        for (const destination of destinations) {
;

            if (destination === 'BKK')  {
                console.log(`BFS found Bangkok!`)
            }

            if (!visited.has(destination)) {
                visited.add(destination);
                queue.push(destination);
            }
           
        }

        
    }

}

bfs('PHX')
```


## Depth-first Search (DFS)

Depth-first Search (DFS) will go as far into the graph as possible until it reaches a node without any children, at which point it backtracks and continues the process. The algorithm can be implemented with a recursive function that keeps track of previously visited nodes. If a node has not been visited, we call the function recursively. 

{{< file "js" "graph.js" >}}
```javascript
function dfs(start, visited = new Set()) {

    console.log(start)
    
    visited.add(start);

    const destinations = adjacencyList.get(start);

    for (const destination of destinations) {

        if (destination === 'BKK') { 
            console.log(`DFS found Bangkok`)
            return;
        }
        
        if (!visited.has(destination)) {
            dfs(destination, visited);
        }

    }

}

dfs('PHX')
```

## Learn More about Recursion

{{< youtube rf60MejMz3E >}}