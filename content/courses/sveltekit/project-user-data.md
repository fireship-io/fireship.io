---
title: Realtime Store
description: Build a custom Svelte store for realtime data
weight: 43
lastmod: 2023-06-26T10:23:30-09:00
draft: false
vimeo: 840218610
emoji: 📅
video_length: 3:34
---


## Simple Data Fetching

If you don't want to write custom stores, here's a simple implementation

```typescript
export const userData = writable<any>(null);

user.subscribe((user) => {

  if (user) {
    const docRef = doc(db, `users/${user.uid}`);
    onSnapshot(docRef, (snapshot) => {
      userData.set(snapshot.data());
    });
  } 
});
```

## Universal Firestore Store

Use this store to easily fetch data from any Firestore document on the client.

```typescript
/**
 * @param  {string} path document path or reference
 * @returns a store with realtime updates on document data
 */
export function docStore<T>(
  path: string,
) {
  let unsubscribe: () => void;

  const docRef = doc(db, path);

  const { subscribe } = writable<T | null>(null, (set) => {
    unsubscribe = onSnapshot(docRef, (snapshot) => {
      set((snapshot.data() as T) ?? null);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
    ref: docRef,
    id: docRef.id,
  };
}
```

## Derived Store

Use a derived store to automatically subscribe to both the user's auth state and Firestore data at the same time. 


```typescript
interface UserData {
  username: string;
  bio: string;
  photoURL: string;
  links: any[];
}

export const userData: Readable<UserData | null> = derived(user, ($user, set) => { 
  if ($user) {
    return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
  } else {
    set(null); 
  }
});  
```