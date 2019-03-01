import { Injectable, ApplicationRef } from '@angular/core';
import { Subject } from 'rxjs';
import { plans } from './stripe-defaults';
import { AuthService } from '../users/auth.service';
import { httpsCallable  } from 'rxfire/functions';
import * as firebase from 'firebase/app';
import { take, map } from 'rxjs/operators';
import get from 'lodash.get';


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

  calcTotal(total, coupon?) {
    if (coupon && coupon.percent_off) {
       total = total - (total * (coupon.percent_off / 100));
    }
    if (coupon && coupon.amount_off) {
      total = total - coupon.amount_off;
    }

    return total;
  }


  allowAuthenticated() {
      return this.auth.user$.pipe(map(v => !!v ));
  }

  allowPro(productId?) {
    return this.auth.userDoc$.pipe(
      map(u => {
        const isPro = get(u, 'is_pro');
        const hasProduct = get(u, `products.${productId}`);
        return !!(isPro || hasProduct);
      })
    );
  }

  async getCoupon(couponId) {
    return this.callFunction('stripeGetCoupon', { couponId });
  }

  async userInvoices() {
    return this.callFunction('stripeGetInvoices', { });
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

  async createSubscription(source, planId, couponId?) {
    return this.callFunction('stripeCreateSubscription', { source, planId, couponId });
  }

  async createOrder(source, sku, couponId?) {
    return this.callFunction('stripeCreateOrder', { source, sku, couponId });
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
      console.log(err);
      serverError = err;
    }

    return { res, serverError };
  }


}
