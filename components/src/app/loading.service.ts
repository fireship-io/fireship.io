import { Injectable, ApplicationRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  state = {
    route: false
  };

  constructor(private app: ApplicationRef) {

    window.addEventListener('router:fetch', (e) => {
      this.state.route = true;
      this.app.tick();
    });
    window.addEventListener('router:end', (e) => {
     setTimeout(() => {
      this.state.route = false;
      this.app.tick();
     }, 500);
    });
   }
}
