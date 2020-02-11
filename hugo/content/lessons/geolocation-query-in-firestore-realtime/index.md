---
title: Realtime GeoQueries with Firestore
lastmod: 2019-12-11T05:30:10-07:00
publishdate: 2018-07-10T05:59:29-07:00
author: Jeff Delaney
draft: false
description: Perform geospatial queries in Firestore based on a radius and visualize realtime updates with Angular Google Maps
tags: 
    - firebase
    - google-maps
    - firestore

youtube: lO1S-FAcZU8
github: https://github.com/codediodeio/geofirex
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

The ability to query by geographic coordinates in Firestore is a highly requested feature because many successful apps - like Uber, Pokemon Go, Instagram, etc - use realtime maps as part of the core user experience. Today you will learn how to build a realtime Google map using Firestore as the data source. 

<p class="tip">Fingers-crossed: It's possible that Firestore will have native support for Geolcation queries in the future, but there is no public timeline for this feature that I'm aware of</p>

## How Geohashing Works

A [geohash](https://www.movable-type.co.uk/scripts/geohash.html) is a string that encodes a bounding box on the globe, with each character in that string being more precise. For example, a 1 character geohash is about 5,000km², while a 9 character string is about 4.77m². It works by segmenting the globe into a set of alphanumeric characters, then segments each segment by the same pattern - like a recursive function or [fractal](https://fractalfoundation.org/resources/what-are-fractals/).  

Saving a geohash in Firestore is easy, but how do we query documents within `9qg5ux7r0`? This is actually quite easy. We can just paginate a query using a high unicode character of `~` because we know it will come after all other characters in the geohash. 


```ts
const start = `9qg5ux7r`
const end = start + '~'

collection
  .orderBy('location')
  .startAt(start)
  .endAt(end)
```

But unfortunately it's not that easy... The query above will give us everything in that geohash square, but doesn't take into account its neighbors. You could have points that are adjacent within 1 nanometer, but not show up in the query because they fall into a different hash. 

In the picture below, only values that fall in the blue geohash boundary will be returned.


{{< figure src="img/geohash-problem.png" caption="The problem with querying a single geohash" >}}

But the cool thing about Firestore is that we can attach multiple realtime listeners to an app simultaneously. This might sound inefficient from a performance standpoint, but listening to data is cheap, it's the size of the data payload that bogs things down. Watch the video below for an in-depth overview from Frank van Puffelen (@puf) about geohashing. 

<div class="videoWrapper">
<iframe width="560" height="315" src="https://www.youtube.com/embed/mx1mMdHBi5Q" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>

## GeoFireX

[GeoFireX](https://github.com/codediodeio/geofirex) is a library born out of the challenges I encountered while building geospatial features in Firestore for a client. Some of its unique features include: 

- Compatible with compound Firestore queries
- Multiple query points on a single document
- Observable-based, hot and cached to allow multiple subscribers. 
- Pipeable operators to transform return values to GeoJSON
- Returns data sorted by distance, with extra metadata about distance and bearing. 

It's impossible to query by radius 100% server-side in Firestore (at least at the time of this article). The library determines the smallest necessary neighboring geohashes required surround the query radius and queries them. It then combines the return values into a single array and filters the remaining documents client-side. 

Performing these calculations accurately on a sphere requires some trigonometry, but luckily there is an amazing geospatial library called [Turf.js](http://turfjs.org/) that does all the heavy lifting. If you're building anything involving geolocation in JavaScript, you should have Turf in your toolkit.

<p class="tip">Client-side filtering means that you might read more documents than what is actually returned by the query. Usually it's a small percentage, but depends on the distribution of points in your dataset.</p>

I've designed the API to match the ergonomics of Firestore as much as possible. Your typical "geoquery" looks like this:

```typescript
const cities = geo.collection('cities')
const center = geo.point(40.1, -119.1);
const radius = 100; // km
const field = 'position';

const query = cities.within(center, radius, field);

query.subscribe();
// [{ ...documentData, queryMetadata: { distance: 1.23232, bearing: 45.23 }  }]
```

In the future, I plan on supporting additional query types, such as...

- `withinPolygon` query within a bounding box (for example a zip code border)
- `closest` query first N closest results for faster performance/efficiency. 

### Alternative Approaches

I'd like to point out that there are several other ways you achieve your geolocation goals. Weigh the pros/cons of each and choose the one that works best for your app.  

- [GeoFire (Realtime DB)](https://github.com/firebase/geofire)
- [Geofirestore](https://github.com/MichaelSolati/geofirestore) 

Also look into alternatives outside of Firebase (but good luck making them realtime):

- [PostGIS](https://postgis.net/)
- [MongoDB Geospatial](https://docs.mongodb.com/manual/geospatial-queries/)
- [Algolia Geo Search](https://www.algolia.com/doc/guides/searching/geo-search/)

## Build a Realtime Google Map

Now that you know a little bit about how geospatial data works, let's build a realtime geo feature with Firestore and Google maps. What we're building is a map this displays a marker for each point in the query. When clicked the marker will display the distance and bearing from the query centerpoint. 

{{< figure src="img/geoquery-firestore.gif" caption="Demo of geospatial query in Firestore" >}}

<p class="tip">The following tutorial assumes that you have an Angular v6 app with AngularFire2 installed, and of course a Firebase project.</p>


The first step is to initialize GeoFireX, which is just a wrapper for the Firebase SDK. 

```shell
npm install geofirex
```

For this demo, we will manage our data state in the component, but you could do this in an Angular service to share your query across multiple components. 

```typescript
// Init Firebase
import * as firebase from 'firebase/app';
firebase.initializeApp(yourConfig);

// Init GeoFireX
import * as geofirex from 'geofirex';

@Component(...)
export class MyComponent  {
  geo = geofirex.init(firebase);
  points: Observable<any>;
}
```

### Angular Google Maps (AGM)

[Angular Google Maps](https://angular-maps.com/) (AGM) is a solid component library that makes building maps in Angular dead simple. You will need to enable Google Maps JS SDK for your Firebase project, the follow official install instructions for AGM. 

We can build the map by declaring its components in the HTML. Notice how I am also adding a `trackBy` function to the loop of markers. This is important for realtime maps because it will prevent unchanged markers from re-rendering on each newly emitted value. 

A special feature of GeoFireX is that we can call `point.queryMetadata.distance` to display the point's relative distance from the query center point, while also accounting for the [curvature of the earth](https://en.wikipedia.org/wiki/Haversine_formula) (thanks Turf.js).
```html
<agm-map [latitude]="34" [longitude]="-113" [zoom]="8">

    <agm-marker 
      *ngFor="let point of points | async; trackBy: trackByFn" 
      [latitude]="point.position.geopoint.latitude" 
      [longitude]="point.position.geopoint.longitude">

        <agm-info-window>

            <h1>This point is {{ point.queryMetadata.distance }} kilometers from the center</h1>

        </agm-info-window>
    </agm-marker>

</agm-map>
```

Also, make sure to give it a width and height in the CSS, otherwise it will be invisible. 

```css
agm-map {
  height: 100vh;
  width: 100vw;
}
```

Here's what that trackBy function looks like in the component TS code:

```typescript
  trackByFn(_, doc) {
    return doc.id;
  }
```


### Saving Geolocation Data in Firestore

Our map is all set, but we need some query-able data in our database. In GeoFireX, a point is saved to the db in the following format:

```typescript
[key: string]: {
  geohash: string; // the geohash
  geopoint: GeoPoint // firestore.GeoPoint
}
```

You name the object whatever you want and save multiple points on a single document. The library provides a the `point` method to help you create this data. 

If updating an existing doc, you can use `setPoint(id, lat, lng)` to non-destructively update the document. 

If creating a new doc with additional data, you can use `setDoc(id, data)`

```typescript
@Component(...)
export class MyComponent  {

  createPoint(lat, lng) {
    const collection = this.geo.collection('places')

    // Use the convenience method
    collection.setPoint('my-place', lat, lng)

    // Or be a little more explicit 
    const point = this.geo.point(lat, lng)
    collection.setDoc('my-place', { position: point.data })
  }
}
```

Now trigger this method a few times to seed your database so we have something to query:

```html
<button (click)="createPoint(38, -119)">Create Me</button>
```


### Query Firestore by Geographic Radius

Now let's setup a query that will run on component initialization to populate our points Observable with data. The `within` method handles this magic and takes three arguments:

- `center` the centerpoint of the query
- `radius` the search radius in kilometers
- `field` the document field with the geopoint object, required because docs can have multiple points


```typescript
@Component(...)
export class MyComponent  {

  ngOnInit() {
    const collection = this.geo.collection('places')
    
    const center = geo.point(38, -119);
    const radius = 100;
    const field = 'point';

    this.points = collection.within(center, radius, field);

    this.points.subscribe()
  }

}
```

<p class="success">Because GeoFireX returns a hot Observable, you can subscribe multiple times without causing extra document reads that would otherwise accrue charges.</p>

And that's it, the `async` pipe will subscribe in the html a populate your map with points. Try updating an existing point's position and you should see it move on the map in realtime. 

### Mapping a Query to GeoJSON

If you've ever used [MapBox](https://blog.mapbox.com/real-time-maps-for-live-events-fad0b334e4e), you probably know that you can set up a data source in GeoJSON format. A cool thing about RxJS is that you can pipe in custom operators to transform the stream to your desired format. Because it's so common, I included an operator in GeoFireX that maps the array of points to a [GeoJSON FeatureCollection](https://macwright.org/2015/03/23/geojson-second-bite.html#featurecollection). 

With almost no extra code, we can completely restructure our results: 

```typescript
import { toGeoJSON } from 'geofirex'

// ...
const query = geo.collection('places').within(...)

this.points = query.pipe( toGeoJSON('point') )
```


## The End

My goal with GeoFireX is simply to make realtime map features as easy to build as possible in PWAs. If you have ideas for the project, please let me know on Github so we can explore them together.  