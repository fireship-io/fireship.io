import { Component, AfterViewInit, ViewEncapsulation, ElementRef, Input } from '@angular/core';
import { AuthService } from '../auth.service';


@Component({
  templateUrl: './google-login.component.html',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class GoogleLoginComponent implements AfterViewInit  {

  @Input() showSignout = false;

  constructor(public auth: AuthService, private el: ElementRef) {}

  ngAfterViewInit() {
    this.el.nativeElement.style.visibility = 'visible';
  }

}
