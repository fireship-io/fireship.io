import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/users/auth.service';

@Component({
  template: ``
})
export class CarbonAdsComponent implements OnInit, OnDestroy {
  sub;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.sub = this.auth.userDoc$.subscribe(user => {
      if (!user || !(user.products || user.is_pro)) {
        this.showAd();
      } else {
        this.removeAd();
      }
    });
  }

  showAd() {
    const carbonScript = document.createElement('script');
    carbonScript.type = 'text/javascript';
    carbonScript.src =
      '//cdn.carbonads.com/carbon.js?serve=CE7DL27N&placement=fireshipio';
    carbonScript.id = '_carbonads_js';
    document.body.appendChild(carbonScript);
  }

  removeAd() {
    document.getElementById('carbonads')?.remove();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
