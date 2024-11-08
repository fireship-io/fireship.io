---
title: Multi-Threading
description: JavaScript parallelism with Workers
weight: 23
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027117829
emoji: 🧵
video_length: 4:03
---

## Deno Workers Fibonacci Example

{{< file "ts" "main.ts" >}}
```typescript
const numbers = [50, 50, 50, 50, 50]; 

numbers.forEach((n) => {
  const worker = new Worker(
    new URL("./worker.ts", import.meta.url).href,
    {
      type: "module",
    }
  );
// 1a. send data to worker to start 
  worker.postMessage({ n });

 // 2b. Receive completed work from worker
  worker.onmessage = (e) => {
    console.log(`Main Thread (n=${n}):`, e.data);
    worker.terminate();
  };
});
```

{{< file "ts" "worker.ts" >}}
```typescript
// @ts-nocheck no types available

function fibonacci(num) {
  if (num <= 1) return num;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

 // 1b. Receive initial work from main thread
self.onmessage = (e) => {
    const { n } = e.data;
  
    const result = fibonacci(n);
    
    // 2a. Send the result back to the main thread
    self.postMessage(result);
    self.close();
  };
```