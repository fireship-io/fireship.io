import { Injectable, ApplicationRef } from '@angular/core';
const defaults = { title: 'Hey!', text: '', icon: '🔔', className: '', dismissed: false };

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  current;

  constructor(private app: ApplicationRef) { }

  setNotification(data) {
    this.current = { ...defaults, ...data };
    this.app.tick();
  }

  dismiss() {
    this.current.dismissed = true;
    this.app.tick();
  }


}
