import { Component, ChangeDetectorRef, AfterViewInit, HostListener, ViewChild, ElementRef, Input } from '@angular/core';
import { environment } from '../../../environments/environment';


import { SetState } from 'src/app/state.decorator';
import { PaymentService } from '../payment.service';
import { tap } from 'rxjs/operators';
import { stripeStyle } from '../stripe-defaults';
import { NotificationService } from 'src/app/notification/notification.service';
import { FormGroup } from '@angular/forms';

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

  // FormGroup Require or angular with throw errors
  fg;

  constructor(private cd: ChangeDetectorRef, public pmt: PaymentService, public ns: NotificationService) {
    this.pmt.product.pipe(
      tap(v => {
        this.setState('product', v);
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
      this.onSuccess();
    }
  }

  async sourceHandler(source) {
    const couponId = this.couponResult && this.couponResult.id;

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
    return this.pmt.calcTotal(this.product.price, this.couponResult);
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
