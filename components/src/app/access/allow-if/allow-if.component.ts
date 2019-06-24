import { Component, ViewEncapsulation, ChangeDetectorRef, Input, AfterViewInit, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/users/auth.service';

@Component({
  templateUrl: './allow-if.component.html',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AllowIfComponent implements AfterViewInit {

  @Input() selector;
  @Input() level: 'pro' | 'user' | 'not-pro' | 'not-user';
  @Input() reverse = false;
  @Input() product;


  constructor(
    private cd: ChangeDetectorRef,
    public auth: AuthService,
    private el: ElementRef,
  ) { }

  ngAfterViewInit() {
    this.el.nativeElement.style.visibility = 'visible';
  }


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
