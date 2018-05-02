import {Component, ComponentRef} from '@angular/core';

@Component({
  selector: 'xgb-notifications',
  templateUrl: './alert-notification.component.html',
  styleUrls: ['./alert-notification.component.css']
})
export class AlertNotificationComponent {

  public details: any;
  public canHide = true;

  public title: string;
  public messageIsHtml: boolean;
  public message: string;

  private componentRef: ComponentRef<AlertNotificationComponent>;

  /**
   * Hide / destroy this notification.
   */
  public hide() {
    if (this.canHide) {
      this.componentRef.destroy();
    }
  }

  /**
   * Sets the reference to this view to be able to destroy it.
   */
  public setViewRef(componentRef: ComponentRef<AlertNotificationComponent>) {
    this.componentRef = componentRef;
  }
}
