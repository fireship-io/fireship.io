---
title: Reddit Style Upvoting in Angular 4 and Firebase
lastmod: 2017-06-23T15:09:54-07:00
publishdate: 2017-06-23T15:09:54-07:00
author: Jeff Delaney
draft: false
description: Create a Reddit-Style Voting System from Scratch with Angular and Firebase
tags: 
    - firebase
    - angular

youtube: mBPURBO1kD8
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

⚠️ This lesson has been archived! Check out the [Full Angular Course](/courses/angular) for the latest best practices about building a CRUD app. 

<p>Upvoting and downvoting is an excellent ay handle community-driven content curation. <a href="https://www.reddit.com/r/Angular2/">Reddit</a> is the most famous example of this feature, but it is common throughout the interwebs on places like StackOverflow, Kaggle, and others. In this lesson, we will use Angular 4 and Firebase to implement upvoting with ease.</p>

{{< figure src="img/upvote.gif" caption="An example of the upvote feature UI with Firebase updating in realtime" >}}

## Prerequisites

<p>You need to have user authentication wired up. You also need some other resource in the database that can *upvoted*, such posts, comments, items, etc. Check out these lessons if you get lost. </p>

<ol>
<li><a href="/lessons/angular-firebase-authentication-tutorial-oauth/">OAuth Authentication with Firebase</a></li>
<li><a href="/lessons/reactive-crud-app-with-angular-and-firebase-tutorial/">CRUD App with Angular and Firebase</a></li>
</ol>

## Modeling the Voting Data in NoSQL

<p>Our database needs to answer two questions as efficiently as possible. (1) Did this user vote for an item? (2) How many people voted on an item? </p>

<p>We can answer these questions by creating a collection of itemIds (using the firebase $key for items), with each document containing key-value pairs of userIDs (auth uid). The key is the userId and the value is their vote, which can be +1, 0, or –1. </p>

```
-| upvotes
    -| itemId
      -| userId: number
```


<p>To answer the first question, we can query the table with the itemId, then see if there is an existing userId key and vote value. We answer the second question by counting get the sum of the vote values. </p>

## Upvote Service

<p>We will use a service to query Firebase for the upvote data. First, we need a function to get the document for a specific item as a `FirebaseObjectObservable`. Next, we need to update the document when the user casts a vote. Here we sent the object key equal to the userId, then update the document with vote value. </p>

### upvote.service.ts

```typescript
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

@Injectable()
export class UpvoteService {

  constructor(private db: AngularFireDatabase) { }

  getItemVotes(itemId): FirebaseObjectObservable<any> {
    // Gets total votes
    return this.db.object(`upvotes/${itemId}`)
  }

  updateUserVote(itemId, userId, vote): void {
    // Creates or updates user's vote
    let data = {}
    data[userId] = vote
    this.db.object(`upvotes/${itemId}`).update(data)
  }

}
```

## Upvote Component TypeScript



<p>Most of the work will happen in the component. First, we are passing the component an itemId and userId via the `@Input()` decorator. Again, check out the prerequisites if you’re app still needs authentication. It should look like this:</p>

```html
<upvote-button [itemId]='item?.$key' [userId]='user?.uid'></upvote-button>
```

<p>Here’s how the component works step-by-step. </p>

<p>1 The input values are passed from the parent component, then used to interact with the service. We also set variables that will hold the user’s current vote and the total vote count for an item. </p>

<p>2 After injecting the service, we use the `getItemVotes()` function and subscribe to the observable that it returns. The emitted value is a document of userIds and vote values from the database. If a userID is present, we check for the matching userId to see if a vote has cast. </p>

<p><a href="https://lodash.com/docs/">Lodash</a> is used to calculate the total vote count. The `values` function converts the object values into an array, then `sum` does exactly what you would expect. Much cleaner than plain JavaScript!</p>

<p>4 Now we need functions to let the user upvote and downvote. Each of these functions are identical - only the vote value is different, +1 for up and –1 for down. To facilitate the cancellation of votes, a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator">ternary if operator</a> is used to determine a value. It reads like this. “If you already upvoted, then I set your vote to 0, otherwise I set it to 1”. </p>

<p>Lastly, don’t forget to destroy the subscription. If your app has a large amount of content, this feature could definitely introduce memory leaks.</p>

### upvote-button.component.ts

```typescript
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UpvoteService } from '../upvote.service';
import { sum, values } from 'lodash';

@Component({
  selector: 'upvote-button',
  templateUrl: './upvote-button.component.html',
  styleUrls: ['./upvote-button.component.scss']
})
export class UpvoteButtonComponent implements OnInit, OnDestroy {

  @Input() userId;
  @Input() itemId;

  voteCount: number = 0;
  userVote: number = 0;

  subscription;

  constructor(private upvoteService: UpvoteService) { }

  ngOnInit() {
    this.subscription = this.upvoteService.getItemVotes(this.itemId)
                      .subscribe(upvotes => {
                        if (this.userId) this.userVote = upvotes[this.userId]
                        this.voteCount = sum(values(upvotes))
                      })
  }

  upvote() {
    let vote = this.userVote == 1 ? 0 : 1
    this.upvoteService.updateUserVote(this.itemId, this.userId, vote)
  }

  downvote() {
    let vote = this.userVote == -1 ? 0 : -1
    this.upvoteService.updateUserVote(this.itemId, this.userId, vote)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
```

## Upvote Component HTML Template

<p>When the user clicks an arrow, their vote is cast by calling either the upvote or downvote function. The `ngClass` directive is used to apply an active class when the user vote is valued at 1 or –1. In this case, an upvote is colored green and a downvote is red. </p>

### upvote-button.component.html

```html
<div class="votebox">
  <span class="fa fa-arrow-up vote up"
        (click)="upvote()"
        [ngClass]="{'active' : userVote > 0 }">
  </span>
  <span class="vote-count">{{voteCount}}</span>

  <span class="fa fa-arrow-down vote down"
        (click)="downvote()"
        [ngClass]="{'active' : userVote < 0 }">

  </span>
</div>
```

## The Component SCSS

<p>And let's finish this off with some CSS. FontAwesome was used for the arrow icons, BTW. </p>

```scss
.votebox {
  height: 120px;
  width: 120px;
  display: flex;
  text-align: center;
  flex-direction: column;
  font-size: 2em;

  .vote {
    cursor: pointer;
    &:hover {
      color: orange;
    }
  }

  .active.up {
      color: green;
    }

  .active.down {
     color: red;
   }

}
```
