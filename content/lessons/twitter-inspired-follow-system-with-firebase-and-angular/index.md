---
title: Twitter Inspired Follow System with Firebase
lastmod: 2017-06-27T15:36:01-07:00
publishdate: 2017-06-27T15:36:01-07:00
author: Jeff Delaney
draft: false
description: Create a twitter-inspired follow unfollow system with Angular and Firebase
tags: 
    - angular
    - firebase

youtube: gNT5YBjLD2Q
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

⚠️ This lesson has been archived! Check out the [Full Angular Course](/courses/angular) for the latest best practices about building a CRUD app. 

<p>The idea of user following and unfollowing has been around since the rise of Twitter, but add this feature into an app is not as easy as you might think. It is an inherently <a href="https://www.upwork.com/hiring/data/sql-vs-nosql-databases-whats-the-difference/">relational</a> problem, so making it work with a NoSQL database requires some tradeoffs. In this lesson, we are going to build twitter-inspired follow and unfollow feature using on Firebase and Angular 4. </p>

```shell
 ng g service follow
 ng g component user-profile
```

## Prerequisites

<p>You need to have the <a href="https://github.com/angular/angularfire2">AngularFire2</a> package installed with user authentication configured to get started with followers. Our Firebase authentication system also save the user information to the database, so check the <a href="http://angularfirebase.com/lessons/angular-firebase-authentication-tutorial-oauth/">OAuth lesson</a> if you get lost. </p>

<img src="https://angularfirebase.com/wp-content/uploads/2017/06/follow.gif" alt="demo of firebase angular twitter follower feature" width="600" height="338" class="content-image" />

{{< figure src="img/follow.gif" caption="Demo of twitter follow unfollow feature in Firebase" >}}

## Modeling the User Followers in NoSQL

<p>In a SQL database, you would model <a href="https://stackoverflow.com/questions/4895809/database-design-for-followers-and-followings">followers with a many-to-many relationship</a> by saving the follower_id and followed_id into own table, then make a join operation to query the data. </p>

<p>Let’s first consider the two main questions we need to answer. (1) <strong>Is UserA following UserB? </strong>(2) <strong>How many followers does a user have?</strong></p>

<p>In Firebase NoSQL, we can answer question 1 by saving by saving the `userId` of each followed user under their own ID. This will allow us to see who a user if following with a single query. </p>

<p>To answer the second question, we need to model the data in reverse. Each user’s followers will be saved under their Id. </p>

```
following
    followerUserId
        followedUserId: true

followers
    followedUserId
        followerUserId: true
```

### What about data duplication?

<p>Wait, doesn’t this database structure just duplicate the followers? Yes, it does, but sometimes that is a tradeoff you need to make with NoSQL. Our goal is to make these queries as quickly as possible, and sometimes that can only be achieved with data duplication, which a small sacrifice to make for the overall <a href="https://www.couchbase.com/resources/why-nosql">agility of NoSQL</a>. It is almost always better to improve the user experience at the expense of extra data storage. </p>

## Follow Service

<p>The service needs to (1) get the followers of a user to build the follower count (2) get following of the currently logged in user, (3) update the relationship between two users, i.e follow and unfollow. </p>

### follow.service.ts

```typescript
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class FollowService {

  constructor(private db: AngularFireDatabase) { }

  getFollowers(userId: string) {
    // Used to build the follower count
    return this.db.object(`followers/${userId}`)
  }

  getFollowing(followerId:string, followedId:string) {
    // Used to see if UserFoo if following UserBar
    return this.db.object(`following/${followerId}/${followedId}`)
  }

  follow(followerId: string, followedId: string) {
    this.db.object(`followers/${followedId}`).update({ [followerId]: true } )
    this.db.object(`following/${followerId}`).update({ [followedId]: true } )
  }

  unfollow(followerId: string, followedId: string) {
    this.db.object(`followers/${followedId}/${followerId}`).remove()
    this.db.object(`following/${followerId}/${followedId}`).remove()
  }


}
```

## Component with Follow/Unfollow Button

<p>We loop over a list list of users from the database, then the display the user UserProfileComponent. The parent component will pass the `user` and the `currentUser` to the child via the `@Input` decorator. </p>

### some-parent.component.html

```html
You are logged in as <strong>{{currentUser?.displayName }}</strong><hr>
<div *ngFor="let user of users | async">
  <user-profile [user]="user" [currentUser]="currentUser"></user-profile>
</div>
```

<p>Each user profile has a follow/unfollow button and displays that user's total follower count. We will generate two subscriptions that will define the `isFollowing` and `followerCount` variables with their emitted values.</p>

<p>The loadash function `size` will count the total number of keys in an collection. A caveat is that AngularFire2 will return `{ $value: null }` when there is no data, which will make the follower count say 1 when it should actually be 0, which is why we have a `countFollowers` function defined separately.</p>

<p>The `toggleFollow` function is pretty self-explanatory. It triggers the service based on the current user’s relationship to this user profile. </p>

<p>It is also important to tear down these subscriptions with `unsubscribe` to when the component is destroyed to avoid memory leaks - especially if your app has a large number of users. </p>

### user-profile.component.ts

```typescript
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FollowService } from "../../follow.service";
import { size } from "lodash";

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  @Input() user;        // a user who can be followed
  @Input() currentUser; // currently logged in user

  followerCount: number;
  isFollowing: boolean;

  followers;
  following;



  constructor(private followSvc: FollowService) { }

  ngOnInit() {
    const userId = this.user.$key
    const currentUserId = this.currentUser.uid


    // checks if the currently logged in user is following this.user
    this.following = this.followSvc.getFollowing(currentUserId, userId)
                                   .subscribe(following => {

                                      this.isFollowing = following.$value

                                    })

    // retrieves the follower count for a user's profile
    this.followers = this.followSvc.getFollowers(userId)
                                   .subscribe(followers => {

                                     this.followerCount = this.countFollowers(followers)

                                    })
  }


  private countFollowers(followers) {
    if (followers.$value===null) return 0
    else return size(followers)
  }


  toggleFollow() {
    const userId = this.user.$key
    const currentUserId = this.currentUser.uid

    if (this.isFollowing) this.followSvc.unfollow(currentUserId, userId)
    else this.followSvc.follow(currentUserId, userId)
  }


  ngOnDestroy() {
    this.followers.unsubscribe()
    this.following.unsubscribe()
  }


}
```

<p>In the template, we can use the Angular 4 `if-then-else` syntax to display the corresponding button for the current user. </p>

### user-profile.component.html

```html
<div class="profile">
  <img [src]="user.img" width="50px">
  @{{user.username}} has <strong>{{followerCount}}</strong> followers
  <div *ngIf="isFollowing; then unfollowButton else followButton">
      button renders here
  </div>
</div>

<ng-template #followButton>
  <button class="button is-info" (click)="toggleFollow()">Follow</button>
</ng-template>

<ng-template #unfollowButton>
  <button class="button is-warning" (click)="toggleFollow()">Unfollow</button>
</ng-template>
```

## Extra Credit - Scaling up

<p>What happens when your app gets huge and Justin Beiber has 500 million followers? The database queries will start to drag down performance. A better way to handle the the user count is with a background task that updates the count whenever there is new activity. Firebase cloud functions allows you to run tasks wherever their is a new write operation. This would allow you to save a user count for a user in the background, then you would only need a single key-value pair to to get the follower count. </p>

```
userId
    followerCount: number
```

<p>Check out my <a href="http://angularfirebase.com/lessons/text-translator-with-firebase-cloud-functions-onwrite-and-angular/">cloud functions onWrite lesson</a>. For details on implementing this type of cloud function. </p>

<p>That’s it for NoSQL follow unfollow. </p>