---
title: Build Realtime Maps with Mapbox GL
lastmod: 2017-07-28T04:59:58-07:00
publishdate: 2017-07-28T04:59:58-07:00
author: Jeff Delaney
draft: false
description: Build realtime map features with Angular, Firebase, and Mapbox
tags: 
    - angular
    - mapbox
    - firebase

youtube: Zn3Xx-TSrM8
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

<p>In this lesson, I am going to cover the basics of building realtime map features with Angular4, Firebase, and MapBox. Here’s a highlight of what is covered in the code below. </p>

- How to obtain a user’s current location
- How to connect Firebase data with Mapbox
- How to format GeoJSON data.
- How to quickly customize map styles.

{{< figure src="img/map2.gif" caption="realtime interaction between two maps" >}}


## Initial Setup

<p>Start by signing up for a <a href="https://www.mapbox.com/">free Mapbox account</a>, then installing mapbox-gl in your Angular project.</p>

### Install Mapbox GL

```shell
npm install mapbox-gl --save
```

### Add the CSS to index.html

<p>Then you will need to add the Mapbox CSS library to the index.html file. </p>

```html
<link href='https://api.mapbox.com/mapbox-gl-js/v0.38.0/mapbox-gl.css' rel='stylesheet' />
```
### Add the API Token

<p>Lastly, add your Mapox API token to the `environment.ts` file. </p>

```typescript
export const environment = {
  production: false,

  mapbox: {
    accessToken: 'YOUR_TOKEN'
  }
}
```

## Build Custom Maps Quickly with Cartogram

<p>If you want to build a custom map quickly, check out <a href="mapbox.com/cartogram">Cartogram</a>. Simply upload a picture with color scheme you like and most of the customization work is done for you. Mapbox also has an easy to use console for customizing specific map elements, but I'm not going to cover that in this lesson.</p>

{{< figure src="img/map1.gif" caption="use cartogram to quickly customize map styles" >}}


## GeoJSON TypeScript Interface

```shell
ng g class map
```

<p><a href="http://geojson.org/">GeoJSON</a> must always adhere to a specific format, so we will use TypeScript give our code some structure. The interfaces defined below will ensure that our data is formatted properly when being shared in realtime with Mapbox. When converted to JSON, it must follow this format:</p>

### GeoJSON Spec Format

```js
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [125.6, 10.1]
  },
  "properties": {
    "message": "Hello World!"
  }
}
```

### map.ts

<p>Here’s how this format is constrained with TypeScript.</p>

```typescript
export interface IGeometry {
    type: string;
    coordinates: number[];
}

export interface IGeoJson {
    type: string;
    geometry: IGeometry;
    properties?: any;
    $key?: string;
}

export class GeoJson implements IGeoJson {
  type = 'Feature';
  geometry: IGeometry;

  constructor(coordinates, public properties?) {
    this.geometry = {
      type: 'Point',
      coordinates: coordinates
    }
  }
}

export class FeatureCollection {
  type = 'FeatureCollection'
  constructor(public features: Array<GeoJson>) {}
}
```

## Map Service

```shell
ng g service map
```

<p>Our map service will (1) initialize map box with the access token, then (2) handle the retrieval of data from Firebase. All of this is just basic AngularFire2 data updating and retrieval.</p>

### map.service.ts

```typescript
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { GeoJson } from './map';
import * as mapboxgl from 'mapbox-gl';

@Injectable()
export class MapService {

  constructor(private db: AngularFireDatabase) {
    mapboxgl.accessToken = environment.mapbox.accessToken
  }


  getMarkers(): FirebaseListObservable<any> {
    return this.db.list('/markers')
  }

  createMarker(data: GeoJson) {
    return this.db.list('/markers')
                  .push(data)
  }

  removeMarker($key: string) {
    return this.db.object('/markers/' + $key).remove()
  }

}
```

## Map-Box Component

```shell
ng g component map-box
```

<p>Most of the action will be happening in the component. Here is a breakdown of what’s happening. </p>

<p>`initalizeMap()`: Determines the user’s physical browser location if possible, then triggers the map building process.</p>

<p>`buildMap()`: Configures a new map, registers event listeners, and configures the realtime data source. </p>

<p>After the map is loaded, we register a data source for the map named `firebase`. We then subscribe to the markers in the database, updating the data source each time new data is emitted. </p>

<p>For each data point in the geoJSON `FeatureCollection`, a layer will be added that is defined by its corresponding metadata. There are tons of options in the <a href="https://www.mapbox.com/mapbox-gl-js/style-spec/#layers">Mapbox layers API</a> to customize the style of each marker. You can interpolate data from the GeoJSON properties object with single curly braces, which is how to show the content of the `{message}`; </p>

### map-box.component.ts

```typescript
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from '../map.service';
import { GeoJson, FeatureCollection } from '../map';


@Component({
  selector: 'map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss']
})
export class MapBoxComponent implements OnInit{

  /// default settings
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/outdoors-v9';
  lat = 37.75;
  lng = -122.41;
  message = 'Hello World!';

  // data
  source: any;
  markers: any;

  constructor(private mapService: MapService) {
  }

  ngOnInit() {
    this.markers = this.mapService.getMarkers()
    this.initializeMap()
  }

  private initializeMap() {
    /// locate the user
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.map.flyTo({
          center: [this.lng, this.lat]
        })
      });
    }

    this.buildMap()

  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });


    /// Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());


    //// Add Marker on Click
    this.map.on('click', (event) => {
      const coordinates = [event.lngLat.lng, event.lngLat.lat]
      const newMarker   = new GeoJson(coordinates, { message: this.message })
      this.mapService.createMarker(newMarker)
    })


    /// Add realtime firebase data on map load
    this.map.on('load', (event) => {

      /// register source
      this.map.addSource('firebase', {
         type: 'geojson',
         data: {
           type: 'FeatureCollection',
           features: []
         }
      });

      /// get source
      this.source = this.map.getSource('firebase')

      /// subscribe to realtime database and set data source
      this.markers.subscribe(markers => {
          let data = new FeatureCollection(markers)
          this.source.setData(data)
      })

      /// create map layers with realtime data
      this.map.addLayer({
        id: 'firebase',
        source: 'firebase',
        type: 'symbol',
        layout: {
          'text-field': '{message}',
          'text-size': 24,
          'text-transform': 'uppercase',
          'icon-image': 'rocket-15',
          'text-offset': [0, 1.5]
        },
        paint: {
          'text-color': '#f16624',
          'text-halo-color': '#fff',
          'text-halo-width': 2
        }
      })

    })

  }


  /// Helpers

  removeMarker(marker) {
    this.mapService.removeMarker(marker.$key)
  }

  flyTo(data: GeoJson) {
    this.map.flyTo({
      center: data.geometry.coordinates
    })
  }
}
```

### map-box.component.html

<p>In the HTML, we need a div where `id='map'`, which is where the map will be rendered. We also loop over the markers giving the user to “fly” to any given location. </p>

```html
<input type="text" [(ngModel)]="message" placeholder="your message...">
<h1>Markers</h1>
<div *ngFor="let marker of markers | async">
  <button (click)="flyTo(marker)">{{ marker.properties.message }}</button>
  <button (click)="removeMarker(marker)">Delete</button>
</div>

<div class="map" id="map"></div>
```

### Obtaining Current Geolocation with Ionic

<p>If you building for native mobile on Ionic, you can obtain the location data with the <a href="https://ionicframework.com/docs/native/background-geolocation/">Geolocation Service</a>. </p>

<p>That’s it for realtime maps in Angular4. This is just barely scratching the surface of map-driven realtime user experiences. Let me know what you think in the comments. </p>