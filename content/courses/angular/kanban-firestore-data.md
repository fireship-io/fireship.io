---
title: Firestore Data Model
description: Firestore database model for kanban boards and backend security rules. 
weight: 41
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 359145232
emoji: 🔥
video_length: 4:48
---

Model the data in Firestore for the Kanban feature. 

Learn more about [Data Modeling in Firestore](https://fireship.io/courses/firestore-data-modeling/). 

## Data Model

{{< file "ngts" "board.model.ts" >}}
```typescript
export interface Board {
    id?: string;
    title?: string;
    priority?: number;
    tasks?: Task[];
  }

export interface Task {
    description?: string;
    label?: 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'gray';
}
```

## Firestore Security Rules

{{< file "firebase" "firebase rules" >}}
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /boards/{document} {
    
      allow read;
      allow create: if requestMatchesUID();
      allow update: if resourceMatchesUID() && requestMatchesUID();
      allow delete: if resourceMatchesUID(); 
    }
    
    function requestMatchesUID() {
        return request.auth.uid == request.resource.data.uid;
    }

    function resourceMatchesUID() {
        return request.auth.uid == resource.data.uid;
    }
    
  }
}
```

