import { Injectable, ApplicationRef } from '@angular/core';
import { interval, timer, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


const defaults = { title: 'Hey!', text: '', icon: '🔔', className: '', dismissed: false, countdown: 10 };

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  current;

  private countdown;
  private waiter;

  constructor(private app: ApplicationRef) { }

  setNotification(data) {
    this.current = { ...defaults, ...data };
    this.startCountdown(this.current.countdown * 1000);
    this.app.tick();
  }

  startCountdown(len) {
    this.resetCountdown();
    const timingSource = interval(1000);
    const timing = timer(len);
    const example = timingSource.pipe(takeUntil(timing));
    this.countdown = example.subscribe(() => {
      this.current.countdown -= 1;
      this.app.tick();
    });
    this.waiter = timing.subscribe(() => {
      this.dismiss();
    });
  }

  resetCountdown() {
    if (this.countdown instanceof Subscription) {
      this.countdown.unsubscribe();
    }
    if (this.waiter instanceof Subscription) {
      this.waiter.unsubscribe();
    }
  }

  dismiss() {
    this.resetCountdown();
    this.current.dismissed = true;
    this.app.tick();
  }
}
