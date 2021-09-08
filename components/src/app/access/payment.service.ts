import { Injectable, ApplicationRef } from '@angular/core';
import { Subject } from 'rxjs';
import { plans } from './stripe-defaults';
import { AuthService } from '../users/auth.service';
import { httpsCallable  } from 'rxfire/functions';
import { getFunctions } from 'firebase/functions';
import { map } from 'rxjs/operators';
import get from 'lodash.get';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  functions = getFunctions();
  product = new Subject();

  constructor(private app: ApplicationRef, private auth: AuthService) { }

  selectProduct(id: string) {
    this.product.next(plans[id]);
    this.app.tick();
  }

  calcTotal(total: number, coupon?) {
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

  async createOrder(source, sku, amount) {
    return this.callFunction('stripeCreateOrder', { source, sku, amount });
  }

  async cancelSubscription(source, planId) {
    return this.callFunction('stripeCancelSubscription', { source, planId });
  }

  async paypalHandler(order) {
    return this.callFunction('paypalHandler', { order });
  }

  async coinbaseHandler(product) {
    return this.callFunction('coinbaseCreateCharge', { product });
  }


  private async callFunction(name, data) {
    let res;
    let serverError;
    try {
      res = await httpsCallable(this.functions, name)(data).toPromise();
    } catch (err) {
      console.log(err);
      serverError = err;
    }

    return { res, serverError };
  }


}
