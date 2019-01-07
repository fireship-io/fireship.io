import {
  Component,
  ViewEncapsulation,
  ChangeDetectorRef,
  ElementRef,
  Input
} from '@angular/core';
import { SetState } from '../state.decorator';

@Component({
  templateUrl: './lazy.component.html',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class LazyComponent {
  show: boolean;

  @Input() selector: string; // some-component,alt:foo,src:bar

  constructor(private cd: ChangeDetectorRef, private el: ElementRef) {
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
      this.show = true;
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
