import { Component, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { PaymentService } from '../payment.service';
import { SetState } from 'src/app/state.decorator';

@Component({
  selector: 'app-user-charges',
  templateUrl: './user-charges.component.html'
})
export class UserChargesComponent implements AfterViewInit {

  charges: any[];
  loading = true;

  constructor(private cd: ChangeDetectorRef, private pmt: PaymentService) {
  }

  ngAfterViewInit() {
    this.getCharges();
  }

  async getCharges() {

    const { res, serverError } = await this.pmt.userInvoices();
    this.setState('charges', res && res.data);
    this.setState('loading', false);
  }


  @SetState()
  setState(k, v) {
    this[k] = v;
  }

}
