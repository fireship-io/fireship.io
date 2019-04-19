import { Component, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import * as firebase from 'firebase/app';
import { Trace } from '@firebase/performance/dist/src/resources/trace';

@Component({
  templateUrl: './login-modal.component.html'
})
export class LoginModalComponent implements OnDestroy {

  sub;

  trace: Trace;

  constructor(private cd: ChangeDetectorRef, private auth: AuthService) {
    this.sub = this.auth.user$.subscribe(u => u ? this.hide() : null);
    this.trace = firebase.performance().trace('loginModal');
  }

  visible = false;

  // Public toggles
  @Input() show = () => this.toggle(true);
  @Input() hide = () => this.toggle(false);

  toggle(val) {
    this.visible = val;
    this.cd.detectChanges();
    if (val) {
      this.trace.start();
    } else {
      try {
        this.trace.stop();
      } catch (e) {}
    }
  }

  ngOnDestroy() {
    return this.sub && this.sub.unsubscribe();
  }
}
