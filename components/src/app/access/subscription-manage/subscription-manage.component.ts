import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/users/auth.service';
import { tap } from 'rxjs/operators';
import { PaymentService } from '../payment.service';
import { SetState } from 'src/app/state.decorator';
import { getAnalytics, logEvent } from 'firebase/analytics';

@Component({
  templateUrl: './subscription-manage.component.html'
})
export class SubscriptionManageComponent implements OnDestroy {
  docSub;
  userDoc;
  subs;

  analytics = getAnalytics();

  loading = true;
  canceling = false;
  serverError;

  constructor(private cd: ChangeDetectorRef, public auth: AuthService, private pmt: PaymentService) {
    this.docSub = this.auth.userDoc$
      .pipe(
        tap(async v => {
          this.userDoc = v;
          const { res, serverError } = await this.pmt.getSubscriptions();
          this.subs = res.data;
          this.serverError = serverError;
          this.loading = false;
          this.cd.detectChanges();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.docSub.unsubscribe();
  }

  total(total, coupon) {
    return this.pmt.calcTotal(total, coupon);
  }


  async cancel(subId) {
    this.setState('canceling', true);
    const proceed = confirm('Are you sure? You may not be able to reactivate your subscription at the current rate');

    if (proceed) {
      await this.pmt.cancelSubscription(this.auth.user.uid, subId);
    }

    this.setState('canceling', false);
    logEvent(this.analytics, 'canceled_membership', { });
  }

  @SetState()
  setState(k, v) {
    this[k] = v;
  }
}
