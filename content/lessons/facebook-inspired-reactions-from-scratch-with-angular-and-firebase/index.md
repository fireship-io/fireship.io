---
title: Facebook-Inspired Reactions From Scratch
lastmod: 2017-07-05T16:00:54-07:00
publishdate: 2017-07-05T16:00:54-07:00
author: Jeff Delaney
draft: false
description: Build a Facebook-inspired reaction component to allow users to like or react to your content.
tags: 
    - angular
    - firebase

youtube: _G5blkXLePY
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

⚠️ This lesson has been archived! Check out the [Full Angular Course](/courses/angular) for the latest best practices. 

<p>In this lesson, we are going to build a Facebook-inspired reaction component. It works by mapping each reaction type to an integer then saves it with an associated userId. This is similar to the reddit voting system lesson, with some added complexity to manage the various reaction types. </p>

## Importing the Graphics

<p>First, let’s add some graphics to the assets folder. I’m using Icon Finder to download free replicas of the <a href="https://www.iconfinder.com/iconsets/facebook-ui-colored">Facebook UI in SVG format</a>.</p>

<p>In this tutorial, I am going to add them to `src/assets/reactions/`, but you might consider hardcoding them as Base64 strings because they are very small images. </p>

{{< figure src="img/react.gif" caption="Reactions demo" >}}

## Mapping the Emoji Graphics to Integers

<p>For the sake of simplicity, let’s map the emojis to integers. A user can only have one reaction per item. To avoid mixing up the index of each reaction emoji, we will define them in an array. </p>

```js
emojiList = ['like', 'love', 'wow', 'haha', 'sad', 'angry']
```

<p>Now each emoji name is connected to an integer index, `like-0`, `love-1`, `wow-2`, etc. </p>

## Data Modeling

<p>In the database, the the `userId` will be the key and the index integer will be the value for keeping track of reactions, with each key-value pair nested under the corresponding `itemId`. </p>

```
reactions
    itemId
        $userId: integer (0 to 5)
```

## Reactions Service

<p>The reactions service needs to grab the current reactions for an item, then give the user functions to update/remove them. I am also defining a couple utility functions to handle the sorting/counting reactions when they are emitted from an observable. </p>

### reaction.service.ts

```typescript
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as _ from "lodash";

@Injectable()
export class ReactionService {

  userId: string;
  emojiList = ['like', 'love', 'wow', 'haha', 'sad', 'angry']

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((auth) => {
      if (auth) this.userId = auth.uid
    });
  }

  getReactions(itemId): FirebaseObjectObservable<any> {
    return this.db.object(`reactions/${itemId}`)
  }

  updateReaction(itemId, reaction=0) {
    const data = { [this.userId]: reaction }
    this.db.object(`reactions/${itemId}`).update(data)
  }

  removeReaction(itemId) {
    this.db.object(`reactions/${itemId}/${this.userId}`).remove()
  }

  countReactions(reactions: Array<any>) {
    return _.mapValues(_.groupBy(reactions), 'length')
  }

  userReaction(reactions: Array<any>) {
    return _.get(reactions, this.userId)
  }

}
```

<p>`countReactions()` takes advantage of Lodash to group the reactions by their value, then count the length of entries, returning an object that looks like this:</p>

```js
{
    "0": number,
    "1": number,
    // 2,3,4
    "5": number
}
```

<p>`userReaction()` simply checks to see if the user’s ID is present in the reactions and returns its value. </p>

## Reactions Component

<p>The component will subscribe to the reactions as a `FirebaseObjectObservable`, then map them to an object of counts and determine the current user’s reaction. </p>

<p>`react()` will see if the users’s vote matches the current reaction and remove it if true. If false, it will update the user’s reaction to this new value. </p>

### reaction.component.ts

```typescript
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ReactionService } from '../reaction.service';
import * as _ from "lodash";

@Component({
  selector: 'reaction',
  templateUrl: './reaction.component.html',
  styleUrls: ['./reaction.component.scss']
})
export class ReactionComponent implements OnInit, OnDestroy {

  @Input() itemId: string;

  showEmojis = false;
  emojiList: string[];

  reactionCount: any;
  userReaction: any;

  subscription: any;

  constructor(private reactionSvc: ReactionService) { }

  ngOnInit() {
    this.emojiList = this.reactionSvc.emojiList

    this.subscription = this.reactionSvc.getReactions(this.itemId)
                         .subscribe(reactions => {

                           this.reactionCount = this.reactionSvc.countReactions(reactions)
                           this.userReaction  = this.reactionSvc.userReaction(reactions)

    })
  }


  react(val) {
    if (this.userReaction === val) {
      this.reactionSvc.removeReaction(this.itemId)
    } else {
      this.reactionSvc.updateReaction(this.itemId, val)
    }
  }

  toggleShow() {
    this.showEmojis = !this.showEmojis
  }


  emojiPath(emoji) {
   return `assets/reactions/${emoji}.svg`
  }

  hasReactions(index) {
    return _.get(this.reactionCount, index.toString())
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
```

First, there needs to be some type of parent component that can be reacted to, whose `$key` gets passed to the child.

### reaction.component.html

```html
<reaction [itemId]="item.$key"></reaction>
```

<p>The component HTML will display the reaction options in a tooltip, just like Facebook. A `showEmojis` boolean variable is toggled with the `mouseenter` and `mouseleave` events. </p>

<p>From there, we loop over the the emojis, using `*ngFor` to extract both the value and the index of the array. Each emoji will trigger the `react(i)` function with its index number on click. </p>

<p>Next, we replicate the like text button and notice `userReaction != null`. This statement is used because 0 will evaluate to false, which corresponds to the like action. </p>

<p>Lastly, We loop over the emojis again, this time using the `reactionCount` to show the number reactions for each type. </p>

```html
<div class="wrapper" (mouseenter)="toggleShow(true)" (mouseleave)="toggleShow(false)">
  <div class="emojis" *ngIf="showEmojis">

    <span *ngFor="let emoji of emojiList; index as i;">
      <img [src]="emojiPath(emoji)" width='75px' (click)="react(i)">
    </span>

  </div>

  <span class="like" (click)="react(0)" [class.liked]="userReaction != null">
      Like
  </span>

  <span *ngIf="userReaction != null">
    | You reacted <strong>{{ emojiList[userReaction] }}</strong>
  </span>

  <div class="reactions">

    <div *ngFor="let emoji of emojiList; index as i;" class="reaction-counts">

      <span *ngIf="hasReactions(i)">
        <img [src]="emojiPath(emoji)"> {{ reactionCount[i] }}
      </span>

    </div>
  </div>
</div>
```

## SCSS Styles

<p>Here is the SCSS used in this lesson. It’s just a rough start, but I wanted to include include it for completeness. </p>

```scss
.wrapper {
  position: relative;
  padding: 20px;
  img {
    width: 70px;
    cursor: pointer;
    transition: transform 250ms ease;

    &:hover {
      transform: scale(2);
      transition: transform 250ms ease;
    }
  }

}

.like {
  cursor: pointer;
  &.liked {
    font-weight: bold;
    color: #3B5998;
  }
}

.emojis {
  position: absolute;
  top: -80px;
  background: white;
  border: 1px lightgray solid;
  box-shadow: 0px 0px 16px 3px rgba(0,0,0,0.45);
  border-radius: 80px;
  display: inline-block;
}


.reactions {
  height: 40px;
  margin-bottom: 20px;
}

.reaction-counts {
  height: 100px;
  display: inline;
  float: left;

  img {
    position: relative;
    bottom: -10px;
    width: 32px;
  }
}
```

<p>That’s it for Facebook-inspired reactions. Let me know what you think in the comments. </p>