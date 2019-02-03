import { Component, OnInit, ChangeDetectorRef, AfterViewInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../../environments/environment';

import { httpsCallable  } from 'rxfire/functions';
import * as firebase from 'firebase/app';
import { SetState } from 'src/app/state.decorator';

declare var Stripe;

@Component({
  templateUrl: './payment-form.component.html'
})
export class PaymentFormComponent implements AfterViewInit {

  stripe: any;
  elements: any;
  card: any;
  prButton: any;
  amount = 2500;

  serverError;
  formState;
  loadingState;

  // error;
  // complete = false;

  @ViewChild('cardElement') cardElement: ElementRef;
  @ViewChild('prElement') prElement: ElementRef;

  constructor(private cd: ChangeDetectorRef) { }

  get usd() {
    return (this.amount / 100).toFixed(2);
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

    const style = {
      base: {
        iconColor: '#9aa6b3',
        color: '#fff',
        fontWeight: 700,
        fontFamily: 'ratio, sans-serif',
        fontSize: '21px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': {
          color: '#9aa6b3',
          fontWeight: 500
        },
        '::placeholder': {
          color: '#9aa6b3',
        },
      },
      invalid: {
        iconColor: '#ff3860',
        color: '#ff3860',
      },
    };

    // Create an instance of the card Element.
    this.card = this.elements.create('card', { style, iconStyle: 'solid' });



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

    try {
      const res = await httpsCallable(firebase.functions(), 'stripeSetSource')({ source }).toPromise();
      console.log(res);

      console.log('success');
    } catch (err) {
      console.log(err);
      this.setState('serverError', err.message);
    }


    // const res = await fetch('http://localhost:5000/fireship-app/us-central1/stripeTester', {
    //   method: 'POST',
    //   body: JSON.stringify(source)
    // });


    this.setState('loadingState', null);
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
