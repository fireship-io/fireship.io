---
title: "Http With Angular Quick Start"
lastmod: 2017-10-11T10:56:12-07:00
publishdate: 2017-10-11T10:56:12-07:00
author: Jeff Delaney
draft: false
description: Use the Angular HTTP Client and to make requests to API endpoints
tags: 
    - angular

youtube: _05v0mrNLh0
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

In this lesson, we are going to use the [Angular HTTP Client](https://angular.io/guide/http) to make API calls to an API endpoint to retrieve data. My goal is to teach you the fundamental concepts needed to start using one of the thousands of RESTful APIs in the world. 

<p class="info">This lesson uses the newer `HttpClientModule` introduced in Angular 4.3, not to be confused with the old standalone HttpModule.</p>

To simulate requests to a real API we are using [JSONPlaceholder](https://jsonplaceholder.typicode.com/). 

## HTTP High Level Overview

HTTP is just [messaging system between clients and servers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages). A client sends a request, a server sends a response - that's the gist.  

The Angular HTTP Client is a toolkit of helpers that enable you to send and receive data with restful HTTP endpoints in a developer-friendly way. Virtually all modern apps need to make API calls over HTTP, so this is a critical area to understand.
 

### HTTP Verbs and Status Codes

<p class="tip">Virtually all APIs that you will encounter are [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) that return data in JSON format - but there are other paradigms out there.</p>

An HTTP verb is sent by the client (Angular) to the server that conveys the intent for the operation. It's like saying *I want to GET some data from your server's database*. 

Angular takes the common HTTP verbs and converts them to methods on the HTTP service. For example, to make a GET request, you will call a method like `http.get('http://endpoint')` and it will return the response as an RxJS `Observable` (you can easily convert it to a promise if you prefer). Let's quickly review the most common HTTP verbs used in RESTful APIs and what they do on the server. 

HTTP verbs are sent by the client to the server (common short list). 

- GET: Read data
- POST: Create new data
- PUT: Replace existing data
- PATCH: Modify existing data
- DELETE: Delete data

The server responds with a status code

- 200 Level: Success.
- 300 Level: Redirect. The endpoint has moved. 
- 400 Level: Client screwed up. Bad request, not authorized, etc. 
- 500 Level: Server screwed up. Server error, bad gateway, etc.  


### HTTP Header and Body

Clients send messages with a header & body, likewise servers respond with a header & body. Clients send an HTTP verb with the requests, while servers respond with a status code. 

The *header* contains important metadata that can be used for validation on either side of the message exchange. 

The *body* is the actual data sent between parties, and it not always necessary. 


### Plain JavaScript vs Angular HTTP

Here's one way we might make a GET request in plain JavaScript. 

```js
function reqListener () {
  var tweets = JSON.parse(this.response)
  console.log(tweets);
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", 'http://www.twitter.com/apiEndpoint');
oReq.send();
```

Here's how to achieve the same thing in Angular (much cleaner). 

```typescript
http.get('http://www.twitter.com/apiEndpoint')
    .subscribe(tweets => console.log(tweets)) );
```

## Generating Angular API Code with Swagger (Optional)

This part is optional, but I want to share a very powerful API framework called Swagger. If you want to generate the frontend code for an API quickly, head over the [Swagger Editor](https://editor.swagger.io). 

<p class="info">Swagger still uses the old Angular2 HTTP module for generating code. It's still useful, but you would not want to use the code line for line. Hopefully the code generator is updated to Angular5 in the future.</p>

Swagger allows you to define your API in a simple readable format using YAML. Once defined, you can generate code for your Angular frontend. You can also generate code for a NodeJS back-end (very useful for Firebase Cloud Functions HTTP triggers). Furthermore, Swagger is used by Google Cloud Platform and Amazon Web Services as the standard template for their API services, so it's a good tool to learn. 


{{< figure src="img/swagger-angular-ts.png" caption="Using swagger to build the clientside API code in Angular." >}}


## Import the HTTP Client in Angular

You first need to import the HTTP Client in the NgModule that uses it. 

### app.module.ts

In this case, we import the `HttpClientModule` in the app module. 


```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; /// <--- here

import { AppComponent } from './app.component';

@NgModule({
  imports: [ 
    BrowserModule, 
    FormsModule, 
    HttpClientModule /// <--- and here
  ], 
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
```

### app.component.ts

In the app component, I have created a shell with the imports that we will need for the upcoming examples. 

```typescript
import { Component } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {

  readonly ROOT_URL = 'https://jsonplaceholder.typicode.com';


  constructor(private http: HttpClient) {}


}


```


## How to Make a GET Request

Making a GET request is as simple as pointing the `http.get(url)` method to an endpoint that will respond with data. 

```typescript
  posts: Observable<any>;

  getPosts() {
    this.posts = this.http.get(this.ROOT_URL + '/posts')    
  }
```

Now that we have our response data from the API in an Observable, we can display it in the HTML by looping with the `async` pipe. 

```html
<div *ngFor="let post of posts | async">
  {{ post | json }}
</div>
```


{{< figure src="img/http-get-angular.gif" caption="Example of get request using Angular HTTP Client" >}}

## How to Make a GET Request with a Typescript Interface

Angular allows us to strong type HTTP requests based on an interface. I have updated the GET request from the previous example to use our own custom `Post` interface. 

```typescript
export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}
```
Then we can tell our get request to use the interface because the Angular HTTP client uses [TypeScript generics](https://www.typescriptlang.org/docs/handbook/generics.html) under the hood.  

```typescript
  posts: Observable<Post[]>;

  getPosts() {
    this.posts = this.http.get<Post[]>(this.ROOT_URL + '/posts')
  }
```



## How to Make a POST Request

When making a POST request, we must pass a data payload as the second argument to represents the request body. 

```typescript
  createPost() {
    const data = {
      id: null,
      userId: 23,
      title: 'My New Post',
      body: 'Hello World!'
    } 

    this.newPost = this.http.post(this.ROOT_URL + '/posts', data)
  }
```


```html
<button (click)="createPost()">Create Post</button>

{{ newPost | async | json }}
```


{{< figure src="img/http-post-angular.gif" caption="Result of POST request" >}}


## How to Customize URL Parameters
<p class="info">URL params allow you to send data with a request that can be parsed on the server, for example: `https://example.com/posts?userId=1`</p>

Angular makes it easy to work with URL params so you don't have to hard code them into the URL string.  

```typescript
getPosts() {
  const params = new HttpParams().set('userId', '1');

  this.posts = this.http.get(this.ROOT_URL + '/posts', { params })    
}
```

## How to Customize Request Headers

In many cases, you might need to send custom headers with your requests. A common requirement in Angular is to send a [JSON Web Token (JWT)](https://jwt.io/introduction/) to the server with each HTTP request to validate the current user. If you want to learn more about decoding authentication tokens, checkout this [secure firebase cloud functions lesson](https://angularfirebase.com/lessons/secure-firebase-cloud-functions/).


```typescript
getPosts() {
  const headers = new HttpHeaders().set('Authorization', 'auth-token');

  this.posts = this.http.get(this.ROOT_URL + '/posts', { headers })    
}
```


## How to Catch and Retry Errors

RxJS has some handy operators for catching errors from the Angular HTTP client. The `catch` operator will allow us to handle errors and treat the returned value as an Observable. You can also throw in the `retry` operator to tell Angular to resend the HTTP request a certain number of times if it encounters an error on the initial attempt. 

```typescript
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/retry';
import 'rxjs/add/observable/of';

///... omitted
  createPost() {
    this.newPost = this.http.post(this.ROOT_URL + '/bad-endpoint', data)
    
      .retry(3)
      .catch(err => {
        console.log(err)
        return Observable.of(err)
      })
  }
```
