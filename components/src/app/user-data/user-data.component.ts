import { Component, ChangeDetectorRef, Input,  } from '@angular/core';
import { AuthService } from 'src/app/users/auth.service';
import { plans } from '../access/stripe-defaults';

@Component({
  templateUrl: './user-data.component.html'
})
export class UserDataComponent {


  @Input() field;

  planData(sku) {
    const plan = Object.keys(plans).find(k => plans[k].sku && plans[k].sku === sku);
    return plans[plan];
  }

  constructor(private cd: ChangeDetectorRef, public auth: AuthService) {}
}
