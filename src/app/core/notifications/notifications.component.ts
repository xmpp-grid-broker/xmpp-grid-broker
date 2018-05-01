import {Component, ComponentRef} from '@angular/core';

@Component({
  selector: 'xgb-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {

  public details: any;
  public canHide = true;

  public title: string;
  public messageIsHtml: boolean;
  public message: string;

  private componentRef: ComponentRef<NotificationsComponent>;

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
  public setViewRef(componentRef: ComponentRef<NotificationsComponent>) {
    this.componentRef = componentRef;
  }
}
