import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../notification.service';

@Component({
  selector: 'xgb-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  errorMessage: string;
  isActive: boolean;

  constructor(private notificationService: NotificationService) {

  }

  ngOnInit() {
    this.isActive = false;
    this.notificationService.notification.subscribe((message) => {
      this.errorMessage = message;
      this.isActive = true;
    });
  }

  hide() {
    this.isActive = false;
  }
}
