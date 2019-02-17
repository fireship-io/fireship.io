import { Injectable, ApplicationRef } from '@angular/core';
import { Subject } from 'rxjs';
import { plans } from './stripe-defaults';
import { AuthService } from '../users/auth.service';
import { httpsCallable  } from 'rxfire/functions';
import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  product = new Subject();

  constructor(private app: ApplicationRef, private auth: AuthService) { }

  selectProduct(id: string) {
    this.product.next(plans[id]);
    this.app.tick();
  }


  async userCharges() {
    return this.callFunction('stripeGetCharges', {});
  }

  async userInvoices() {
    return this.callFunction('stripeGetInvoices', {});
  }

  //// Payment Capture Events ////

  async getCustomer() {
    return this.callFunction('stripeGetCustomer', { });
  }

  async getSubscriptions() {
    return this.callFunction('stripeGetSubscriptions', { });
  }

  async setSource(source) {
    return this.callFunction('stripeSetSource', { source });
  }

  async createSubscription(source, planId, discountId?) {
    return this.callFunction('stripeCreateSubscription', { source, planId, discountId });
  }

  async createPurchase(source, productId, discountId?) {
    return this.callFunction('stripeCreatePurchase', { source, productId, discountId });
  }

  async cancelSubscription(source, planId, discountId?) {
    return this.callFunction('stripeCancelSubscription', { source, planId });
  }




  private async callFunction(name, data) {
    let res;
    let serverError;
    try {
      res = await httpsCallable(firebase.functions(), name)(data).toPromise();
    } catch (err) {
      serverError = err;
    }

    return { res, serverError };
  }


}
