import { Component, ChangeDetectorRef, AfterViewInit, HostListener, ViewChild, ElementRef, Input } from '@angular/core';
import { environment } from '../../../environments/environment';


import { SetState } from 'src/app/state.decorator';
import { PaymentService } from '../payment.service';
import { tap } from 'rxjs/operators';
import { stripeStyle } from '../stripe-defaults';
import { NotificationService } from 'src/app/notification/notification.service';

declare var Stripe;

@Component({
  templateUrl: './payment-form.component.html'
})
export class PaymentFormComponent implements AfterViewInit {

  @Input() action = 'purchase';

  // Global product selection
  product;

  // Stripe Elements
  stripe: any;
  elements: any;
  card: any;
  prButton: any;
  pr: any;

  // UI State
  serverError;
  formState;
  loadingState;
  success;

  // Coupon State
  couponResult;
  couponError;
  couponLoading: boolean;


  @ViewChild('cardElement') cardElement: ElementRef;
  @ViewChild('prElement') prElement: ElementRef;

  constructor(private cd: ChangeDetectorRef, public pmt: PaymentService, public ns: NotificationService) {
    this.pmt.product.pipe(
      tap(v => {
        this.setState('product', v);
      })
    )
    .subscribe();
  }

  ngAfterViewInit() {
    this.setup();
  }

  setup() {
    this.stripe = Stripe(environment.stripe);
    this.elements = this.stripe.elements(
      {
        fonts: [{
          cssSrc: 'https://use.typekit.net/rcr1opg.css'
        }]
      }
    );

    // Create an instance of the card Element.
    this.card = this.elements.create('card', { style: stripeStyle, iconStyle: 'solid' });
    this.card.mount(this.cardElement.nativeElement);

    this.listenToFormState();
    this.cd.detectChanges();
  }

  listenToFormState() {
    this.card.addEventListener('change', (event) => {
      this.setState('formState', event);
    });
  }

  async handleForm(e) {
    e.preventDefault();
    this.setState('loadingState', 'validating card...');
    const { source, error } = await this.stripe.createSource(this.card);

    if (error) {
      this.setState('loadingState', null);
      this.setState('serverError', `Unsuccessful ${error}`);
    }


    this.setState('loadingState', 'processing...');

    const { res, serverError } = await this.sourceHandler(source);

    console.log(res);

    if (serverError) {
      this.setState('serverError', serverError.message);
      this.setState('loadingState', null);
    } else {
      this.onSuccess();
    }
  }

  async sourceHandler(source) {
    const couponId = this.couponResult && this.couponResult.id;
    console.log(23, couponId);

    switch (this.action) {
      case 'purchase':
        if (this.product.type === 'subscribe') {
          return this.pmt.createSubscription(source, this.product.planId, couponId);
        }

        if (this.product.type === 'order') {
          return this.pmt.createOrder(source, this.product.sku, couponId);
        }
        break;


      case 'source':
        return this.pmt.setSource(source);
        break;
    }
  }

  onSuccess() {
    this.card.clear();
    this.pmt.product.next(null);
    this.ns.setNotification({ title: 'Success!', text: 'Thank you :)' });
    this.setState('loadingState', null);
    this.setState('success', true);
  }

  get total() {
    let total = this.product.price;
    const coupon = this.couponResult;
    console.log(coupon);
    if (coupon && coupon.percent_off) {
       total = total - (total * (coupon.percent_off / 100));
    }
    if (coupon && coupon.amount_off) {
      total = total - coupon.amount_off;
    }

    console.log(total);

    return total;
  }

  async applyCoupon(e, val) {
    e.preventDefault();
    this.couponResult = null;
    this.couponError = null;
    this.couponLoading = true;
    this.cd.detectChanges();

    const { res, serverError } = await this.pmt.getCoupon(val);

    if (res && res.valid) {
      this.couponResult = res;
    } else {
      this.couponError = true;
    }
    this.couponLoading = false;
    this.cd.detectChanges();
  }

  @HostListener('document:DOMContentLoaded')
  domContentLoaded() {
    if (!this.stripe) {
      this.setup();
    }
  }

  @SetState()
  setState(k, v) {
    this[k] = v;
  }


}





// @SetState()
// setPr() {
//   if (this.pr) {
//     this.pr.update({ total: { amount: this.total } });
//   } else {
//     this.pr = this.stripe.paymentRequest({
//       country: 'US',
//       currency: 'usd',
//       total: {
//         label: 'Fireship.io Access',
//         amount: this.total,
//       },
//       requestPayerName: true,
//       requestPayerEmail: true,
//     });

//     this.prButton = this.elements.create('paymentRequestButton', {
//       paymentRequest: this.pr
//     });

//     // this.pr.canMakePayment().then(console.log);

//     this.pr.canMakePayment().then(result => {
//       if (result) {
//         this.prButton.mount('#payment-request-button');
//       } else {
//         document.getElementById('payment-request-button').style.display = 'none';
//       }
//     });

//     this.pr.on('source', async(e) => {
//       console.log(e);
//       this.setState('loadingState', 'processing...');

//       const { res, serverError } = await this.sourceHandler(e.source.id);

//       if (serverError) {
//         this.setState('serverError', serverError.message);
//       } else {
//         this.onSuccess();
//       }
//     });
//   }

// }
