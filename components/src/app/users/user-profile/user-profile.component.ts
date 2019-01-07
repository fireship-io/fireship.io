import { Component, Input } from '@angular/core';

@Component({
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent {

  @Input() uid;
  @Input() photoURL;
  @Input() displayName;

}
