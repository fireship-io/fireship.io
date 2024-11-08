---
title: TypeScript Crash Course
description: Everything you need to know about TypeScript
weight: 5
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027462404
emoji: 💎
video_length: 9:04
free: true
---



## Basic Type Checking

{{< file "ts" "app.ts" >}}
```typescript
// Variables
const num = 23; // implicit type
let str: string; // explicit type

// Functions
export function multiply(a:number, b:number) {
    return a * b
}
```

## Types and Interfaces

```typescript
let human: Human;

type Human = {
    dna: string,
    age: number,
    sex: HumanSex
}

type HumanSex = 'male' | 'female' | 'cyborg'


const human: Human = {
    dna: "AGTC",
    age: 23,
    sex: 'cyborg',
}
```

## Generics


```typescript
type Dog = { name: string };
type Cat = { name: string };

const animal = { name: 'fluffy' }

type Robot<T> = {
    chip: string;
    animal: T;
}


const robotCat: Robot<Cat> = { animal, chip: 'Intel' };
const robotDog: Robot<Dog> = { animal, chip: 'AMD' };
```



## How do add Types for Browser APIs

{{< file "ts" "app.ts" >}}
```typescript
/// <reference lib="dom" />
```

