---
title: Angular Toast Message Notifications From Scratch
lastmod: 2017-07-03T15:50:19-07:00
publishdate: 2017-07-03T15:50:19-07:00
author: Jeff Delaney
draft: false
description: Send toast notifications to users with Angular and Firebase.
tags: 
    - angular
    - firebase

youtube: MlbLcUF77eU
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

⚠️ This lesson has been archived! Check out the [Full Angular Course](/courses/angular) for the latest best practices. 

<p>In this lesson, we are going to build <a href="https://ux.stackexchange.com/questions/11998/what-is-a-toast-notification">toast notifications</a> from scratch with Angular 4. There are a couple of good <a href="https://www.npmjs.com/package/angular2-toaster">Angular toast packages</a> that solve this problem, but it’s not very hard to do from scratch. </p>

<p>This implementation provides a feed of 5 messages/notifications, which the user can dismiss by clicking. A service will manage the notifications, so they can be observed or updated from any component. </p>

<p>You could manage notifications completely client side, but I am going to store the toast messages on the backend Firebase database as well. This is useful if you plan on showing the user a notification history, serve users on multiple platforms, or if you need messages to persist between sessions. It also opens the possibility to manage notifications with Cloud Functions in the background.</p>

## Frontend Design

<p>In this demo, I am using <a href="http://bulma.io/documentation/elements/notification/">Bulma</a> on the frontend, but you could easily swap our the CSS with Bootstrap, Material, or your own custom classes. </p>

<p>We will have three different types of messages, `success`, `info`, and `danger` and a close button to dismiss the notifications to remove them from the feed. </p>

{{< figure src="img/toast.gif" caption="Toast Message Demo" >}}

## The Toast Service

<p>The `ToastService` can be injected anywhere in the app to trigger notifications. First, let’s define a new class to conceptualize the message itself.</p>

```typescript
export class Message {
  content: string;
  style: string;
  dismissed: boolean = false;

  constructor(content, style?) {
    this.content = content
    this.style = style || 'info'
  }

}
```

<p>A Message must be instantiated with a `content` string, and can also be passed an optional `style?` argument. </p>

<p>`getMessages` function will return a `FirebaseListObservable`, limited to the last 5 messages. </p>

<p>`sendMessage` can be called anywhere in your app to update the current toast feed. </p>

<p>`dismissMessage` should be trigged by the user to hide the message.</p>

```typescript
@Injectable()
export class ToastService {


  constructor(private db: AngularFireDatabase) { }

  getMessages(): FirebaseListObservable<Message[]> {
    return this.db.list('/messages', {
      query: {
        orderByKey: true,
        limitToLast: 5
      }
    });
  }

  sendMessage(content, style) {
    const message = new Message(content, style)
    this.db.list('/messages').push(message)
  }

  dismissMessage(messageKey) {
    this.db.object(`messages/${messageKey}`).update({'dismissed': true})
  }

}
```

## Reversing and Filtering the Observable with a Pipe

<p>We need to create a custom pipe that can (1) reverse the order of the messages to show the most recent first and (2) filter out the dismissed messages. Run `ng g pipe reverse`, then import the `filter` and `reverse` functions from Lodash. </p>


```typescript
import { Pipe, PipeTransform } from '@angular/core';
import { filter, reverse } from 'lodash';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

  transform(value) {
      if (!value) return;

      value = filter(value, ['dismissed', false])

      return reverse(value)
    }

}
```

## Building the Toast Messages Component

<p>The component itself will go directly in the `AppComponent`, outside the scope of the router, because we want users to see it no matter where they are. </p>

```html
<router-outlet></router-outlet>
<toast-messages></toast-messages>
```

<p>The component’s template will loop over the observable -- notice how we are chaining together the the pipes `async | reverse`. Then use `ngClass` to match the message style to Bulma’s notification CSS styles. Lastly, the dismiss function is added on the button click. </p>

```html
<div class="wrapper">
  <aside  *ngFor="let message of messages | async | reverse">
    <div class="notification"

         [ngClass]="{'is-info':     message.style=='info',
                     'is-danger':   message.style=='danger',
                     'is-success':  message.style=='success'}">

      <button class="delete" (click)="dismiss(message.$key)"></button>
      {{message.content}}
    </div>

  </aside>
</div>
```

<p>In the TypeScript, we just inject the service and set the messages variable. </p>

```typescript
import { Component, OnInit } from '@angular/core';
import { ToastService } from '../toast.service';

@Component({
  selector: 'toast-messages',
  templateUrl: './toast-messages.component.html',
  styleUrls: ['./toast-messages.component.scss'],
})
export class ToastMessagesComponent implements OnInit {

  messages: any;

  constructor(private toast: ToastService) { }

  ngOnInit() {
    this.messages = this.toast.getMessages()
  }

  dismiss(itemKey) {
    this.toast.dismissMessage(itemKey)
  }

}
```

## Triggering New Messages from Anywhere

<p>The cool thing about  realtime apps is their ability to update the messages from anywhere. Simply inject it into a component, then call `toast.sendMessage(content, style)` and you’re good to go, for example</p>


```typescript
  infoMessage() {
    const message = "I have some useful information for you..."
    this.toast.sendMessage(message, 'info')
  }
```

<p>That’s it for toast message notifications with Angular 4 and Firebase. </p>