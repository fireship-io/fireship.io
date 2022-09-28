---
title: Auth Guard
description: Protect routes with guards.
weight: 33
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 359089400
emoji: 👮
video_length: 4:59
---

Use a router guard to protect routes from unauthorized users and show a snackbar error message. 

## Steps 

### Step 1 - Generate the Guard

{{< file "terminal" "command line" >}}
```text
ng g guard user/auth
```

{{< file "ngts" "auth.guard.ts" >}}
```typescript
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { SnackService } from '../services/snack.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private snack: SnackService
  ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {

    const user = await this.afAuth.currentUser;
    const isLoggedIn = !!user;
    if (!isLoggedIn) {
      this.snack.authError();
    }
    return isLoggedIn;
  }
}

```

### Step 2 - Show a SnackBar

Generate a global service that can be used to show snack bar message from any component. 

{{< file "terminal" "command line" >}}
```text
ng g service services/snack
```

{{< file "ngts" "snack.service.ts" >}}
```typescript
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SnackService {
  constructor(private snackBar: MatSnackBar, private router: Router) {}

  authError() {
    this.snackBar.open('You must be logged in!', 'OK', {
      duration: 5000
    });

    return this.snackBar._openedSnackBarRef
      .onAction()
      .pipe(
        tap(_ =>
          this.router.navigate(['/login'])
        )
      )
      .subscribe();
  }
}

```