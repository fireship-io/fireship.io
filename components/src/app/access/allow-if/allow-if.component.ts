import { Component, AfterViewInit, ViewEncapsulation, ChangeDetectorRef, ElementRef, Input, OnDestroy } from '@angular/core';
import { PaymentService } from '../payment.service';
import { SetState } from 'src/app/state.decorator';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: './allow-if.component.html',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AllowIfComponent implements AfterViewInit, OnDestroy {

  @Input() selector;
  @Input() level: 'pro' | 'user';

  sub;

  allowed = false;

  constructor(
    private cd: ChangeDetectorRef,
    private el: ElementRef,
    private pmt: PaymentService
  ) { }

  ngAfterViewInit() {
    let obsv;
    if (this.level === 'pro') {
      obsv = this.pmt.allowPro();
    } else {
      obsv = this.pmt.allowAuthenticated();
    }

    this.sub = obsv.pipe(tap(v => this.allow(v))).subscribe();

  }

  // appendComponent() {
  //   if (this.selector) {
  //     const segments = this.selector.split(',');
  //     const tag = segments.splice(0, 1)[0];

  //     const component = document.createElement(tag);
  //     for (const pair of segments) {
  //       const [ k, v ] = pair.split(':');
  //       component.setAttribute(k, v);
  //     }

  //     this.el.nativeElement.appendChild(component);
  //   }
  // }

  ngOnDestroy() {
    if (this.sub) { this.sub.unsubscribe(); }
  }

  @SetState()
  allow(v) {
    console.log('aa', v);
    this.allowed = v;
  }

}
