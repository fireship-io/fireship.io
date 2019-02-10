import { Component, ChangeDetectorRef } from '@angular/core';
import { PaymentService } from '../payment.service';
import { SetState } from 'src/app/state.decorator';

@Component({
  selector: 'app-user-charges',
  templateUrl: './user-charges.component.html'
})
export class UserChargesComponent {

  charges: any[];
  loading = false;

  constructor(private cd: ChangeDetectorRef, private pmt: PaymentService) { }

  async getCharges() {
    this.setState('loading', true);
    const { res, serverError } = await this.pmt.userCharges();
    this.setState('charges', res.data);

    console.log(res, serverError);
    this.setState('loading', false);
  }


  @SetState()
  setState(k, v) {
    this[k] = v;
  }

}
