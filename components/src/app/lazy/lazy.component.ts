import {
  Component,
  ViewEncapsulation,
  ChangeDetectorRef,
  ElementRef,
  Input,
  AfterViewInit
} from '@angular/core';
import { SetState } from '../state.decorator';

@Component({
  templateUrl: './lazy.component.html',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class LazyComponent implements AfterViewInit {
  show: boolean;

  @Input() selector: string; // some-component,alt:foo,src:bar

  constructor(private cd: ChangeDetectorRef, private el: ElementRef) {}

  ngAfterViewInit() {
    if ((window as any).IntersectionObserver) {
      this.show = false;
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.appendComponent();
            this.toggleShow(true);
            observer.disconnect();
          }
        });
      });
      observer.observe(this.el.nativeElement);
    } else {
      this.appendComponent();
      this.toggleShow(true);
    }
  }

  appendComponent() {
    if (this.selector) {
      const segments = this.selector.split(',');
      const tag = segments.splice(0, 1)[0];

      const component = document.createElement(tag);
      for (const pair of segments) {
        const [ k, v ] = pair.split(':');
        component.setAttribute(k, v);
      }

      this.el.nativeElement.appendChild(component);
    }
  }

  @SetState()
  toggleShow(val) {
    this.show = val;
  }
}
