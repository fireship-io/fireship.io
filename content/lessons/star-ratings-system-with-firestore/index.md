---
title: "Star Ratings System With Firestore"
lastmod: 2017-10-17T11:17:30-07:00
publishdate: 2017-10-17T11:17:30-07:00
author: Jeff Delaney
draft: false
description: Build a five-star rating system from scratch with Firestore
tags: 
    - firestore
    - firebase
    - angular

youtube: I2i3gXoTmcw
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

In this lesson, we will build a five-star rating system from scratch with Angular and Firebase. 

Knowing how to implement star reviews in Angular is an important skill for a developer because the same concepts are used for likes, hearts, votes, and many other common UX features. 

## Firestore Data Structure

How do we model star-ratings in a NoSQL database like firestore? In the SQL world, this is known as a `many-to`-many-through` relationship where *Users have many Movies through Reviews* AND *Movies have many Users through Reviews*  

Firestore is a document database that is optimized for LARGE collections and SMALL documents. Learn more in the [Firestore Data Modeling Guide](/courses/firestore-data-modeling)


{{< figure src="img/many-to-many-through-nosql-06.png" caption="Example of a many-to-many-through relationship" >}}

In the diagram above, we can see how the movies collection and users collection have a two-way connection through the stars *middle-man* collection. All data about a relationship is kept in the star document - data never needs to change on the connected user/movie documents directly. 

Having a root collection structure allows us to query both "Movie reviews" and "User reviews" independently. This would not be possible if stars were nested as a sub collection. 

## Initial Setup

I am going to focus on the middle-man star collection because that is were all the magic happens. You can set up a similar data relationship between any two collections - users and movies could just as easily be rainbows and unicorns. If your app still needs a [user auth system with firestore](https://angularfirebase.com/lessons/google-user-auth-with-firestore-custom-data/), please follow firestore OAuth lesson to get up and running quickly. 

Our final product will look like this:

{{< figure src="img/firestore-relational-data-stars.gif" caption="Realtime star reviews demo" >}}

### App Component

For this demonstration, I am going to manually create a few `user` documents and a `movie` document. As you will see, the `StarService` is completely independent, so you can easily drop it into your app. All you need is a reference to the two `AngularFirestoreDocument` objects that you want to connect. 

Here's what the database collections and documents look like in Firestore.

{{< figure src="img/firestore-star.png" caption="Star reviews in the database" >}}

In the app component, we will make a reference to the current user and movie. In the real world, you would get your user from an auth service. Movies might come from a URL param or a collection of movies. These issues are not directly relevant to our star feature, so I am simply hard coding them in the app component. 

I also created a couple of getters to retrieve the document ID from the `AngularFirestoreDocument`. 

```typescript
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  userDoc: AngularFirestoreDocument<any>;
  movieDoc: AngularFirestoreDocument<any>;
  
  user: Observable<any>;
  movie: Observable<any>; 

  constructor(private afs: AngularFirestore) { }
  
  ngOnInit() {
    this.userDoc = this.afs.doc('users/test-user-3')
    this.movieDoc = this.afs.doc('movies/battlefield-earth')

    this.movie = this.movieDoc.valueChanges()
    this.user = this.userDoc.valueChanges()
  }

  get movieId() {
    return this.movieDoc.ref.id
  }

  get userId() {
    return this.userDoc.ref.id
  }

}
```

The typescript getters will allow us to conveniently pass the document ids to a child component, which we are going to build later in the lesson. 

```html
<star-review [movieId]="movieId" [userId]="userId"></star-review>
```

## The Star Service

```shell
ng g service star --module app
```

The star service will handle interaction with the stars collection in the Firestore back-end database. 

- Get reviews by User
- Get reviews by Movie
- Set/update a review relationship


```typescript
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

export interface Star {
  userId: any;
  movieId: any;
  value: number;
}


@Injectable()
export class StarService {

  constructor(private afs: AngularFirestore) { }

  // Star reviews that belong to a user
  getUserStars(userId) {
    const starsRef = this.afs.collection('stars', ref => ref.where('userId', '==', userId) );
    return starsRef.valueChanges();
  }

  // Get all stars that belog to a Movie
  getMovieStars(movieId) {
    const starsRef = this.afs.collection('stars', ref => ref.where('movieId', '==', movieId) );
    return starsRef.valueChanges();
  }

  // Create or update star
  setStar(userId, movieId, value) {
    // Star document data
    const star: Star = { userId, movieId, value };

    // Custom doc ID for relationship
    const starPath = `stars/${star.userId}_${star.movieId}`;

    // Set the data, return the promise
    return this.afs.doc(starPath).set(star)
  }

}
```


## The StarReview Component

```shell
ng g component star-review
```

You can drop the star review component into any other component that has access to a movie reference. It acts as a child component that will display/update reviews for its parent component - in this case movies. 

The star review component will perform the following tasks. 

- Show the average star rating
- List other users star ratings
- Allow user so set their own rating 

The star service only requires a `userId` and `movieId`, therefore we can pass these values from the parent component using the `@Input` decorator. 


```typescript
import { Component, OnInit, Input } from '@angular/core';
import { StarService } from '../star.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'star-review',
  templateUrl: './star-review.component.html',
  styleUrls: ['./star-review.component.scss']
})
export class StarReviewComponent implements OnInit {


  @Input() userId;
  @Input() movieId;

  stars: Observable<any>;
  avgRating: Observable<any>;

  constructor(private starService: StarService) { }

  ngOnInit() {
    this.stars = this.starService.getMovieStars(this.movieId)

    this.avgRating = this.stars.map(arr => {
      const ratings = arr.map(v => v.value)
      return ratings.length ? ratings.reduce((total, val) => total + val) / arr.length : 'not reviewed'
    })
  }

  starHandler(value) {
    this.starService.setStar(this.userId, this.movieId, value)
  }


}
```

In the HTML, we can easily unwrap the average rating Observable with the async pipe. Then we can also loop over the stars observable to show ratings from other users.

To implement the clickable star buttons, we need to style radio buttons as star icons. In this case, we have 10 clickable radio buttons ranging from 0.5 to 5 stars. When clicked buy the user, it will trigger the `starHandler(val)` method and update the corresponding data in Firestore. 

Rather than code 10 different inputs, I loop over 5 integers and wrap the full-star and half-star in an `ng-container` - that reduces the HTML code by ~80%. 


Note: It's important that the the `id` on the input matches the `for` property on the label.  

```html
<h3>Average Rating</h3>

{{ avgRating | async }}


<h3>Reviews</h3>
<div *ngFor="let star of stars | async">

  {{ star.userId }} gave {{ star.movieId }} {{ star.value }} stars

</div>


<h3>Post your Review</h3>

<fieldset class="rating">
  <ng-container  *ngFor="let num of [5, 4, 3, 2, 1]">
      <!-- full star -->
      <input (click)="starHandler(num)" 
            [id]="'star'+num"
            [value]="num-0.5"
            name="rating" 
            type="radio" />

      <label class="full" [for]="'star'+num"></label>

      <!-- half star -->
      <input (click)="starHandler(num-0.5)" 
             [value]="num-0.5"
             [id]="'halfstar'+num" 
             name="rating" 
             type="radio"  />

      <label class="half" [for]="'halfstar'+num"></label>

  </ng-container>
</fieldset>

```

Lastly, I wanted to include the CSS that makes the star UI possible. 

I borrowed the CSS for my stars from this [CodePen](https://codepen.io/jamesbarnett/pen/vlpkh), but the HTML has been modified for use in Angular. The CSS depends on [FontAwesome](http://fontawesome.io/) icons, so make sure to include them in your project if using this code. 

```scss
fieldset, label { margin: 0; padding: 0; }
body{ margin: 20px; }
h1 { font-size: 1.5em; margin: 10px; }

.rating { 
  border: none;
  float: left;
}

.rating > input { display: none; } 
.rating > label:before { 
  margin: 5px;
  font-size: 1.25em;
  font-family: FontAwesome;
  display: inline-block;
  content: "\f005";
}

.rating > .half:before { 
  content: "\f089";
  position: absolute;
}

.rating > label { 
  color: #ddd; 
 float: right; 
}

.rating > input:checked ~ label,
.rating:not(:checked) > label:hover, 
.rating:not(:checked) > label:hover ~ label { color: #FFD700;  } 

.rating > input:checked + label:hover, 
.rating > input:checked ~ label:hover,
.rating > label:hover ~ input:checked ~ label,  selection 
.rating > input:checked ~ label:hover ~ label { color: #FFED85;  } 
```

## The End

Congrats, you now have a solid foundation for modeling user data relationships in Firestore. Please reach out if you have any questions. 