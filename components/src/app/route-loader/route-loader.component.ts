import { Component, ViewEncapsulation } from '@angular/core';
import { LoadingService } from '../loading.service';

@Component({
  templateUrl: './route-loader.component.html',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class RouteLoaderComponent {
  constructor(public loading: LoadingService) {  }
}
