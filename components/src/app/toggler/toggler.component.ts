import { Component, ViewEncapsulation, AfterViewInit, ChangeDetectorRef, ElementRef, Input } from '@angular/core';
import { SetState } from '../state.decorator';

@Component({
  templateUrl: './toggler.component.html',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class TogglerComponent implements AfterViewInit {

  show: boolean;

  @Input() selector;
  target: HTMLElement;


  constructor(private cd: ChangeDetectorRef, private el: ElementRef) { }

  ngAfterViewInit() {
    this.el.nativeElement.style.visibility = 'visible';
    this.target = document.querySelector(this.selector) as any;
  }

  @SetState()
  toggle(val?) {
    this.show = val || !this.show;
    if (this.target) {
      const state = this.show ? 'visible' : 'hidden';
      this.target.style.visibility = state;
      if (state === 'visible') {
        this.target.classList.add('show');
      } else {
        this.target.classList.remove('show');
      }
    }
  }

}
