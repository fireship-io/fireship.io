import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/users/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: './user-details.component.html'
})
export class UserDetailsComponent implements OnDestroy {
  docSub;
  userDoc;

  constructor(private cd: ChangeDetectorRef, public auth: AuthService) {
    this.docSub = this.auth.userDoc$
      .pipe(
        tap(v => {
          this.userDoc = v;
          this.cd.detectChanges();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.docSub.unsubscribe();
  }
}
