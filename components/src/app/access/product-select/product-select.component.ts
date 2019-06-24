import { Component, Input } from '@angular/core';
import { PaymentService } from '../payment.service';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: './product-select.component.html'
})
export class ProductSelectComponent {

  @Input() productId;
  @Input() text = 'Choose Plan';
  @Input() className = 'btn btn-green pricing-button';

  activeProduct;

  constructor(public pmt: PaymentService) {
    this.pmt.product.pipe(
      tap(v => {
        this.activeProduct = v;
        document.getElementById('paymentWrapper').scrollIntoView({ behavior: 'smooth'});
      })
    )
    .subscribe();
  }

  get isSelected() {
    return this.activeProduct && this.activeProduct.id === this.productId;
  }

}
