import { Component, ViewEncapsulation, Input } from '@angular/core';

@Component({
  templateUrl: './modal-button.component.html',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ModalButtonComponent {

  @Input() selector: string;

  showModal() {
    const modal = document.querySelector(this.selector) as any;
    modal.show();
  }
}
