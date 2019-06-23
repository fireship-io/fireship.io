import { Component, ViewEncapsulation, ChangeDetectorRef, Input } from '@angular/core';
import { AuthService } from 'src/app/users/auth.service';

@Component({
  templateUrl: './allow-if.component.html',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AllowIfComponent {

  @Input() selector;
  @Input() level: 'pro' | 'user' | 'not-pro' | 'not-user';
  @Input() reverse = false;
  @Input() product;


  constructor(
    private cd: ChangeDetectorRef,
    public auth: AuthService
  ) { }


  get allowed() {
    const u = this.auth.userDoc;
    const products = u && u.products && Object.keys(u.products);


    // Handle Product
    if (products && products.includes(this.product)) {
      return true;
    }

    // Handle Level
    switch (this.level) {
      case 'user':
        return u;

      case 'pro':
        return u && u.is_pro;

      case 'not-pro':
        return u && !u.is_pro;

      case 'not-user':
        return !u;

      default:
        return false;
    }
  }

}
