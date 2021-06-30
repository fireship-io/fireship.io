---
title: Hydrate Next.js Props to Realtime Firestore Data
lastmod: 2021-01-02T08:58:11-07:00
publishdate: 2021-01-02T08:58:11-07:00
author: Jeff Delaney
draft: false
description: Fetch and transitioning server-rendered data with Next.js to realtime Firestore data. 
tags: 
    - react
    - ssr
    - nextjs
    - firestore

type: lessons

# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

versions: 
    "next": 10
    "firebase": 8
    "react-firebase-hooks": 2.2
---

[Next.js](https://nextjs.org/docs/basic-features/data-fetching) application data can be prerendered on the server with `getStaticProps` or at each request with `getServerSideProps`. That's great for search engine optimization, but what if you also need Firestore data to react to realtime updates after the initial render? 

The following snippet outlines techniques for fetching and hydrating server-rendered data with Next.js, while maintaining a realtime connection to Firebase. It assumes usage of [react-firebase-hooks](https://github.com/CSFrequency/react-firebase-hooks) and [Cloud Firestore](/tags/firestore). 


## Transition to Realtime

### Fetch on the Server

Data is fetched on the server with `getStaticProps`, then it's sent to the default component export as props.  

{{< file "react" "some-page.js" >}}
```jsx
// initialize Firebase JS SDK...

export async function getStaticProps(context) {

  const ref = firestore.doc('items/foo');
  const item = (await ref.get()).data();

  return {
    props: { item }
  }
}
```

### Realtime Connection on the Client

The client will receive the predendered data first, then "transition" to a realtime stream from Firestore. It other words, try to show the latest data - but if null - fallback to the `props` value. 

{{< file "react" "some-page.js" >}}
```jsx
import { useDocumentData } from 'react-firebase-hooks/firestore'

export default function SomePage(props) {

  const ref = firestore.doc('items/foo')
  const [item] = useDocumentData(ref)

  return (
    <div>
        { (item ?? props.item).title }
    </div>
  )
}
```

## Custom Firestore SSR Hook

The code above uses the nullish coalescing operator `??` to fallback to props, but that can be cumbersome code to maintain when dealing with many document fields. An alternative approach is to write a custom hook (by extending react-firebase-hooks) that starts with a default value. When Firestore is loading show props, otherwise show the latest realtime value. 


{{< file "react" "custom-hook.js" >}}
```jsx
import { useDocumentData } from 'react-firebase-hooks/firestore'

function useDocumentDataSSR(ref, options) {
  const [value, loading, error] = useDocumentData(ref, options)

  if (options?.startWith && loading) {
    return [options.startWith, loading, error]
  } else {
    return [value, loading, error]
  }

}
```

Now access fields on the Firestore document without worrying about whether it came from props or a realtime update. 

{{< file "react" "some-page.js" >}}
```jsx
export default function SomePage(props) {

  const ref = firestore.doc('items/foo')
  const [item] = useDocumentDataSSR(ref, { startWith: props.item })

  return (
    <div>
        { item?.title }
    </div>
  )
}
```
