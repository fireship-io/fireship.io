import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  templateUrl: './algolia-button.component.html',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AlgoliaButtonComponent {

  showSearch() {
    const search = document.querySelector('algolia-search') as any;
    search.show();
  }
}
