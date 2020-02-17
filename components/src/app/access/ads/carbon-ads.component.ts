

import { Component, OnInit} from '@angular/core';
import { AuthService } from 'src/app/users/auth.service';

@Component({
  template: ``,
})
export class CarbonAdsComponent implements OnInit {

  constructor(
    public auth: AuthService,
  ) { }

  ngOnInit() {
    const user = this.auth.userDoc;

    if (!user || !(user.products || user.is_pro) ) {
        const carbonScript = document.createElement('script');
        carbonScript.type = 'text/javascript';
        carbonScript.src = '//cdn.carbonads.com/carbon.js?serve=CE7DL27N&placement=fireshipio';
        carbonScript.id = '_carbonads_js';
        document.body.appendChild(carbonScript);
    }

  }


}
