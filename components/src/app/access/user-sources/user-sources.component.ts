import { Component, ChangeDetectorRef } from '@angular/core';
import { SetState } from 'src/app/state.decorator';
import { PaymentService } from '../payment.service';

@Component({
  templateUrl: './user-sources.component.html',
})
export class UserSourcesComponent  {

  loading = true;
  customer;

  showForm = false;

  constructor(private cd: ChangeDetectorRef, private pmt: PaymentService) { }

  ngAfterViewInit() {
    this.getCustomer();
  }

  async getCustomer() {
    this.setState('loading', true);
    const { res, serverError } = await this.pmt.getCustomer();
    this.setState('customer', res);

    console.log(res, serverError);
    this.setState('loading', false);
  }

  newSource() {
    this.setState('showForm', true);
  }



  @SetState()
  setState(k, v) {
    this[k] = v;
  }


}
