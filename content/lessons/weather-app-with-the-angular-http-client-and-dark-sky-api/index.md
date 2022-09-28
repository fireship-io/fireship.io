---
title: Build a Weather App with Angular
lastmod: 2017-10-09T11:07:52-07:00
publishdate: 2017-10-09T11:07:52-07:00
author: Jeff Delaney
draft: false
description: Build a weather forecasting app with the Angular HTTP Client and Dark Sky API
tags: 
    - pro
    - angular
    - node

youtube: j6tXvRGZ2Jk
pro: true
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

In this lesson, you will learn how to retrieve weather data from an API and use it in a frontend Angular app. A secure backend built with Firebase Cloud Functions will make the HTTP request to ensure sensitive data is not exposed in Angular. 

The end result looks like this, but you will have access to whole bunch of weather data to completely customize the user experience. 

{{< figure src="img/angular-weather-app.gif" caption="Weather forecasting app demo" >}}

## Initial Setup

It only takes a few simple steps to start making API calls for weather data from our Angular app.

### Sign-up for the Dark Sky API

[Dark Sky](https://darksky.net/dev) allows you to make 1000 free API calls per day. This allows you to experiment with the data and only start paying once your user base grows to a decent size. 


{{< figure src="img/darksky-api.png" caption="" >}}


### Initial Weather App Setup

First, let's generate a component and service for this feature. (You might also create a new NgModule feature at this point, but I am leaving that out for the sake of simplicity) 

```shell
ng g service weather
ng g component local-forecast
```

Then let's make sure everything is included in the `app.module`. 

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { WeatherService } from './weather.service';
import { LocalForecastComponent } from './local-forecast/local-forecast.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LocalForecastComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [WeatherService]
})
export class AppModule { }
```



## Firebase Cloud Functions Proxy Server to Make the Request

<p class="info">If you don't use Firebase, you can follow this same pattern on any back-end server of FaaS.</p>

It is important that our API key does not get exposed in client side Angular code. The only way to do this with absolute security is to keep the API key on a back-end server, such as [Firebase Cloud Functions](https://firebase.google.com/docs/functions/). You could also do this with AWS Lambda or your own custom server. 

If you're using Cloud Functions for the first time, make sure to have Firebase Tools installed and run the following command. 

```shell
firebase init functions
```

### Set the API Key in the Functions Environment

Store the API key securely in the cloud function back-end as an environment variable. Firebase has a built in command to handle this task. 

```shell
firebase functions:config:set darksky.key="YOUR_DARKSKY_API_KEY"
```

### Install Cors and Requestify

We are going use [CORS](https://github.com/expressjs/cors) and [requestify](https://github.com/ranm8/requestify) to simplify the HTTP request from the NodeJS environment. CORS will ensure that calls to the API can only be made from the origin. Requestify just makes the NodeJS HTTP module more user friendly. 

```shell
cd functions
npm install cors requestify --save
```

### Build the Cloud Function in index.js

We only need a simple cloud function that protects the API key and returns the weather data response from DarkSky. If you work with APIs frequently, this function will be extremely useful. You can use it to proxy any API request without exposing your sensitive API keys to end users (who might also be hackers). Most APIs use CORS by default, so it is likely that you will be required to perform this step no matter what. 


```js
const functions = require('firebase-functions');
const http = require('requestify');
const cors = require('cors')({ origin: true });
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

exports.darkSkyProxy = functions.https.onRequest((req, res) => {

    /// Wrap request with cors
    cors( req, res, () => { 

        /// Get the url params
        const lat = req.query.lat
        const lng = req.query.lng

        const url = formatUrl(lat, lng)

        /// Send request to DarkSky
        return http.get(url).then( response => {
            return res.status(200).send(response.getBody());
        })
        .catch(err => {
            return res.status(400).send(err) 
        })
        
    });

});

/// Helper to format the request URL
function formatUrl(lat, lng) {
    const apiKey = firebaseConfig.darksky.key
    console.log(apiKey)
    return `https://api.darksky.net/forecast/${apiKey}/${lat},${lng}`
}
```


### Deploy the function

To use the endpoint we just need to deploy it. 

```shell
firebase deploy --only functions
```

This should return a URL that looks like `https://your-project.cloudfunctions.net/darkSkyProxy`. This is the URL that will be used to make the actual request to DarkSky. The response body is identical to the main API. 

## Weather Service

To make this code maintainable, I am creating a weather service that will handle the API calls. It's also a good idea to make all API calls from a service so components can share data without hitting the API multiple times. After 1000 daily calls, you start paying for usage, so it is important to think about efficiency and caching here. 


### weather.service.ts

The job of the weather service is to make the HTTP request and return an Observable of the weather data response. Notice how it makes the request to our proxy cloud function endpoint, as opposed to hitting the DarkSky API directly. 

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class WeatherService {

  readonly ROOT_URL = 'https://us-central1-firestarter-96e46.cloudfunctions.net/darkSkyProxy';

  constructor(private http: HttpClient) { }

  currentForecast(lat: number, lng: number): Observable<any> {
    let params = new HttpParams()
    params = params.set('lat', lat.toString() )
    params = params.set('lng', lng.toString() )

    return this.http.get(this.ROOT_URL, { params })
  }

}
```

## Local Forecast Component

The app needs to show users a seven day weather forecast for their given location. The response has plenty of data to parse that can be used to customize the user experience, create graphs, timelines, etc.  


### Obtaining Weather Icons

There are several icon fonts designed specifically for weather apps, but I'm going with the open source [WeatherIcons](https://erikflowers.github.io/weather-icons/) library, which behaves just like FontAwesome. The only problem is that that icon classes don't match the icons in DarkSky, so we have to map them manually. 

{{< figure src="img/weather-icons.png" caption="" >}}

To use WeatherIcons with a CDN, add the following link to the `index.html` file. You can also install the icons locally if you prefer. 

```html
<head>
  <!-- omitted -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.9/css/weather-icons.min.css" />
</head>
```

### forecast.component.ts

The component will retrieve the user's current location via `navigator.geolocation`, which is built into most modern web browsers. If not, it will just default to New York City's coordinates. 

Weather Icon class names don't match the icon names in DarkSky, so we have to map them manually. I used a switch statement for this demo, but a better solution would be to map them as key/value pairs in a JS object. 


```typescript
import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do'

@Component({
  selector: 'local-forecast',
  templateUrl: './local-forecast.component.html',
  styleUrls: ['./local-forecast.component.scss']
})
export class LocalForecastComponent implements OnInit {

  lat: number;
  lng: number;
  forecast: Observable<any>;

  constructor(private weather: WeatherService) { }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
       this.lat = position.coords.latitude;
       this.lng = position.coords.longitude;
     });
   } else {
     /// default coords
    this.lat = 40.73;
    this.lng = -73.93;
   }
  }

  getForecast() {
    this.forecast = this.weather.currentForecast(this.lat, this.lng)
      .do(data => console.log(data))
  }


  /// Helper to make weather icons work
  /// better solution is to map icons to an object 
  weatherIcon(icon) {
    switch (icon) {
      case 'partly-cloudy-day':
        return 'wi wi-day-cloudy'
      case 'clear-day':
        return 'wi wi-day-sunny'
      case 'partly-cloudy-night':
        return 'wi wi-night-partly-cloudy'
      default:
        return `wi wi-day-sunny`
    }
  }

}

```


### forecast.component.html

First, we will use a button to allow the user to load the forecast. You could also just load the forecast during `OnInit`.  Next, the observable is unwrapped and set as a template variable. The response from DarkSky contains an array of seven `daily` forecasts. We can loop over this data and display an icon and summary for each day. 

```html
<h1>
  <i class="wi wi-barometer"></i> Your Local Weather Forecast
</h1>

<p>Current Position: {{ lat }} / {{ lng }} </p>

<button (click)="getForecast()">Get Forecast</button>

<h1>Seven Day Forecast</h1>

<div *ngIf="forecast | async as f" class="columns">
    <div *ngFor="let day of f.daily.data" class="column">

        <i [class]="weatherIcon(day.icon)"></i>
        <h3>{{ day.time * 1000 | date: 'MMM d'  }}</h3>
        <p>{{ day.summary }}</p>

    </div>
</div>
```

## The End

That's it. You now have a basic weather forecasting Angular app with a secure back-end proxy cloud function.