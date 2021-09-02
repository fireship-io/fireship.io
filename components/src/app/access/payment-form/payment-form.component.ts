import {
  Component,
  ChangeDetectorRef,
  AfterViewInit,
  HostListener,
  ViewChild,
  ElementRef,
  Input
} from '@angular/core';
import { environment } from '../../../environments/environment';

import { SetState } from 'src/app/state.decorator';
import { PaymentService } from '../payment.service';
import { tap } from 'rxjs/operators';
import { stripeStyle } from '../stripe-defaults';
import { NotificationService } from 'src/app/notification/notification.service';
import { FormGroup } from '@angular/forms';
import { getAnalytics, logEvent } from 'firebase/analytics';

// Global Script Namespaces
declare var Stripe;
declare var paypal;

@Component({
  templateUrl: './payment-form.component.html'
})
export class PaymentFormComponent implements AfterViewInit {
  @Input() action = 'purchase';
  @Input() allowCoupons;

  // Global product selection
  product;

  // Stripe Elements
  stripe: any;
  elements: any;
  card: any;

  // UI State
  serverError;
  formState;
  loadingState;
  incomplete: string; // hosted_invoice_url

  // Coupon State
  couponResult;
  couponError;
  couponLoading: boolean;

  @ViewChild('cardElement') cardElement: ElementRef;
  @ViewChild('paypalElement') paypalElement: ElementRef;

  // FormGroup Require or angular with throw errors
  fg;

  // coinbase state
  cryptoCharge;

  analytics = getAnalytics()

  constructor(
    private cd: ChangeDetectorRef,
    public pmt: PaymentService,
    public ns: NotificationService
  ) {
    this.pmt.product
      .pipe(
        tap(v => {
          this.setState('product', v);
          this.paypalInit();
        })
      )
      .subscribe();
    this.fg = new FormGroup({});
  }

  ngAfterViewInit() {
    this.setup();
  }

  setup() {
    this.stripe = Stripe(environment.stripe);
    this.elements = this.stripe.elements({
      fonts: [
        {
          cssSrc: 'https://use.typekit.net/rcr1opg.css'
        }
      ]
    });

    // Create an instance of the card Element.
    this.card = this.elements.create('card', {
      style: stripeStyle,
      iconStyle: 'solid'
    });
    this.card.mount(this.cardElement.nativeElement);

    this.listenToFormState();
  }

  // PAYPAL INTEGRATION
  paypalInit() {
    this.paypalElement.nativeElement.innerHTML = '';
    const valid = this.productType === 'order';
    if (valid) {
      paypal
        .Buttons({
          createOrder: (data, actions) => {
            if (this.total < 12000 && this.product.id === 'proLifetime') {
              return this.setState(
                'serverError',
                'Coupon exceeds max discount on Lifetime access, try a different coupon '
              );
            }

            return actions.order.create({
              purchase_units: [
                {
                  description: this.product.description,
                  reference_id: this.product.sku,
                  amount: {
                    currency_code: 'USD',
                    value: this.paypalTotal
                  }
                }
              ]
            });
          },
          onApprove: async (data, actions) => {
            this.setState('loadingState', 'processing payment...');
            const order = await actions.order.capture();

            this.setState('loadingState', 'success, setting up PRO access...');

            const { res, serverError } = await this.pmt.paypalHandler(order);

            if (serverError) {
              this.setState('serverError', serverError.message);
              this.setState('loadingState', null);
            } else {
              this.onSuccess();
            }
          },
          onError: err => {
            console.error(err);
            this.setState('serverError', 'Unable to process PayPal payment');
          }
        })
        .render(this.paypalElement.nativeElement);
    }
    this.cd.detectChanges();
  }

  listenToFormState() {
    this.card.addEventListener('change', event => {
      this.setState('formState', event);
    });
  }

  // Fires when form is submitted for product or subscription
  async handleForm(e) {
    e.preventDefault();
    this.setState('serverError', null);
    this.setState('loadingState', 'validating card...');
    const { source, error } = await this.stripe.createSource(this.card);

    if (error) {
      this.setState('loadingState', null);
      this.setState('serverError', `Unsuccessful ${error}`);
    }

    this.setState('loadingState', 'processing...');

    const { res, serverError } = await this.sourceHandler(source);

    if (serverError) {
      this.setState('serverError', serverError.message);
      this.setState('loadingState', null);
    } else {
      console.log(res);
      // Requires 3D secure validation
      const isInvoice = res.object === 'invoice';
      if (res.status === 'incomplete' || (isInvoice && !res.paid)) {
        const { hosted_invoice_url } = isInvoice ? res : res.latest_invoice;
        this.onIncomplete(hosted_invoice_url);

        // Successful payment
      } else {
        this.onSuccess();
      }
    }
  }

  async sourceHandler(source) {
    const couponId = this.couponResult && this.couponResult.id;

    switch (this.action) {
      case 'purchase':
        if (this.productType === 'subscribe') {
          return this.pmt.createSubscription(
            source,
            this.product.planId,
            couponId
          );
        }

        if (this.productType === 'order') {
          return this.pmt.createOrder(source, this.product.sku, this.total);
        }
        break;

      case 'source':
        return this.pmt.setSource(source);
    }
  }

  // Fires when 3D Secure validation is required
  onIncomplete(invoiceURL: any) {
    this.resetForm();
    this.pmt.product.next(null);
    this.setState('incomplete', invoiceURL);
    this.ns.setNotification({
      title: 'Confirmation Required!',
      className: 'box-orange',
      text: `Your payment card must be confirmed via 3D Secure. View the invoice and finish the payment at the following link: ${invoiceURL} `,
      countdown: 300
    });
    logEvent(this.analytics, 'pro_upgrade', {
      value: this.action,
      product: this.product && this.product.id,
      status: 'incomplete'
    });
  }

  onSuccess() {
    this.resetForm();
    this.ns.setNotification({ title: 'Success!', text: 'Thank you :)' });
    logEvent(this.analytics, 'pro_upgrade', {
      value: this.action,
      product: this.product && this.product.id
    });
  }

  private resetForm() {
    this.card.clear();
    this.pmt.product.next(null);
    this.setState('loadingState', null);
  }

  // Total as Stripe integer
  get total(): number {
    return this.pmt.calcTotal(this.product.price, this.couponResult);
  }

  // Total as paypal float
  get paypalTotal() {
    return (this.total / 100).toFixed(2);
  }

  get productType() {
    return this.product && this.product.type;
  }

  async applyCoupon(e, val) {
    e.preventDefault();
    this.couponResult = null;
    this.couponError = null;
    this.serverError = null;
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

  async createCryptoCharge() {
    console.log(this.product);
    const { res } = await this.pmt.coinbaseHandler(this.product);
    this.setState('cryptoCharge', res);

    console.log(this.cryptoCharge);
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
