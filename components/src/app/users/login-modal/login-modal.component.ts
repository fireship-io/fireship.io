import { Component, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login-modal.component.html'
})
export class LoginModalComponent implements OnDestroy {

  sub;

  constructor(private cd: ChangeDetectorRef, public auth: AuthService) {
    this.sub = this.auth.user$.subscribe(u => u ? this.hide() : null);
  }

  visible = false;

  // Public toggles
  @Input() show = () => this.toggle(true);
  @Input() hide = () => this.toggle(false);

  toggle(val) {
    this.visible = val;
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    return this.sub && this.sub.unsubscribe();
  }
}
