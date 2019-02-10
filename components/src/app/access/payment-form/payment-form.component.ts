import { Component, ChangeDetectorRef, AfterViewInit, HostListener, ViewChild, ElementRef, Input } from '@angular/core';
import { environment } from '../../../environments/environment';


import { SetState } from 'src/app/state.decorator';
import { PaymentService } from '../payment.service';
import { tap } from 'rxjs/operators';
import { stripeStyle } from '../stripe-defaults';

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

  // error;
  // complete = false;

  @ViewChild('cardElement') cardElement: ElementRef;
  @ViewChild('prElement') prElement: ElementRef;

  constructor(private cd: ChangeDetectorRef, public pmt: PaymentService) {
    this.pmt.product.pipe(
      tap(v => this.setState('product', v))
    )
    .subscribe();
  }

  // get usd() {
  //   return this.product ? (this.product.price / 100).toFixed(2) : 0;
  // }

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

    // const paymentRequest = this.stripe.paymentRequest({
    //   country: 'US',
    //   currency: 'usd',
    //   total: {
    //     label: 'Demo total',
    //     amount: 1000,
    //   },
    //   requestPayerName: true,
    //   requestPayerEmail: true,
    // });

    // this.prButton = this.elements.create('paymentRequestButton', {
    //   paymentRequest: paymentRequest,
    // });

    // paymentRequest.canMakePayment().then(function(result) {
    //   if (result) {
    //     this.prButton.mount(this.prElement.nativeElement);
    //   } else {
    //     // document.getElementById('payment-request-button').style.display = 'none';
    //   }
    // });


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
    this.setState('loadingState', 'creating source...');
    const { source, error } = await this.stripe.createSource(this.card);

    if (error) {
      this.setState('loadingState', null);
      this.setState('serverError', error);
    }


    this.setState('loadingState', 'attaching source...');

    const { res, serverError } = await this.sourceHandler(source);

    console.log(res);

    if (serverError) {
      this.setState('serverError', serverError.message);
    }


    // const res = await fetch('http://localhost:5000/fireship-app/us-central1/stripeTester', {
    //   method: 'POST',
    //   body: JSON.stringify(source)
    // });


    this.setState('loadingState', null);
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
