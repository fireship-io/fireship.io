import { Component, ChangeDetectorRef, Input,  } from '@angular/core';
import { AuthService } from 'src/app/users/auth.service';

@Component({
  templateUrl: './user-data.component.html'
})
export class UserDataComponent {

  @Input() field;

  constructor(private cd: ChangeDetectorRef, public auth: AuthService) {}
}
