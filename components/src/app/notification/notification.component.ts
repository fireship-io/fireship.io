import { Component, OnInit } from '@angular/core';
import { NotificationService } from './notification.service';

@Component({
  templateUrl: './notification.component.html'
})
export class NotificationComponent {

  constructor(public ns: NotificationService) { }

}
