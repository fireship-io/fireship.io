import { Component, OnInit, ChangeDetectorRef, AfterViewInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../../environments/environment';

import { httpsCallable  } from 'rxfire/functions';
import * as functions from 'firebase/functions';

declare var Stripe;


@Component({
  templateUrl: './payment-form.component.html'
})
export class PaymentFormComponent implements AfterViewInit {

  stripe: any;
  elements: any;
  card: any;
  prButton: any;

  @ViewChild('cardElement') cardElement: ElementRef;
  @ViewChild('cardErrors') cardErrors: ElementRef;
  @ViewChild('prElement') prElement: ElementRef;

  constructor(private cd: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.setup();
  }

  setup() {
    this.stripe = Stripe(environment.stripe);
    this.elements = this.stripe.elements();

    const paymentRequest = this.stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Demo total',
        amount: 1000,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    this.prButton = this.elements.create('paymentRequestButton', {
      paymentRequest: paymentRequest,
    });

    paymentRequest.canMakePayment().then(function(result) {
      if (result) {
        this.prButton.mount(this.prElement.nativeElement);
      } else {
        // document.getElementById('payment-request-button').style.display = 'none';
      }
    });


    // Create an instance of the card Element.
    this.card = this.elements.create('card');

    this.card.mount(this.cardElement.nativeElement);


    this.card.addEventListener('change', (event) => {
      const displayError = this.cardErrors.nativeElement;
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    this.cd.detectChanges();
  }

  async handleForm(e) {
    e.preventDefault();
    const { token, error } = await this.stripe.createSource(this.card);
    console.log(token, error);
    // const fun = httpsCallable(functions, 'setSource');
    // fun({ token })
    const res = await functions().httpsCallable('stripeSetSource')({ token });

    console.log('success');
  }

  @HostListener('document:DOMContentLoaded')
  domContentLoaded() {
    if (!this.stripe) {
      this.setup();
    }
  }





}
