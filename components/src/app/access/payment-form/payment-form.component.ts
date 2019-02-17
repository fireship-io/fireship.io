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

  @Input() action = 'subscribe';

  // Global product selection
  product;

  // Stripe Elements
  stripe: any;
  elements: any;
  card: any;
  prButton: any;

  // UI State
  serverError;
  formState;
  loadingState;
  success;


  @ViewChild('cardElement') cardElement: ElementRef;
  @ViewChild('prElement') prElement: ElementRef;

  constructor(private cd: ChangeDetectorRef, public pmt: PaymentService, public ns: NotificationService) {
    this.pmt.product.pipe(
      tap(v => this.setState('product', v))
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
      this.setState('serverError', error);
    }


    this.setState('loadingState', 'processing...');

    const { res, serverError } = await this.sourceHandler(source);

    console.log(res);

    if (serverError) {
      this.setState('serverError', serverError.message);
    } else {
      this.onSuccess();
    }
  }

  async sourceHandler(source) {
    switch (this.action) {
      case 'subscribe':
        return this.pmt.createSubscription(source, this.product.planId);

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
