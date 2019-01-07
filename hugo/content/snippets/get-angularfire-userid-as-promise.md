---
title: Return an @angular/fire User as a Promise
lastmod: 2018-12-29T10:40:01-07:00
publishdate: 2018-12-29T10:40:01-07:00
author: Jeff Delaney
draft: false
description: How to return an AngularFire user as a promise
tags: 
    - angular
    - rxjs
    - firebase

# versions: 
#     - "rxjs": 6.3
---


@angular/fire provides an `authState` Observable which is great for reacting to realtime changes to the user's login state. However, it can be useful to also return this value as a Promise for one-off operations and for use with async/await. 

Let's say we have an auth service using Firebase. We can take the `first()` emitted value from the stream, then convert it using `toPromise()`; 

{{< file "ngts" "app/auth.guard.ts" >}}
{{< highlight typescript >}}
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

    constructor(private afAuth: AngularFireAuth) { }

    getUser(): Promise<any> {
        return this.afAuth.authState.pipe(first()).toPromise();
    }

}
{{< /highlight >}}




## Usage with Async/Await in a Guard

Now we can use this method throughout the app for tasks that do not require a stream, like database writes or in router guards as shown below: 

{{< file "ngts" "app/auth.guard.ts" >}}
{{< highlight typescript >}}
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService} from './auth.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  async canActivate(...): Promise<boolean> {

      const user = await this.auth.getUser();
      const loggedIn = !!user;

      if (!loggedIn) {
          // do something
      }

      return loggedIn;
  }
}
{{< /highlight >}}