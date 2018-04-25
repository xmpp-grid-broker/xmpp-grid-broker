import {Component, ComponentRef} from '@angular/core';

@Component({
  selector: 'xgb-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {

  public errorMessage: string;
  private componentRef: ComponentRef<NotificationsComponent>;

  /**
   * Hide / destroy this notification.
   */
  public hide() {
    this.componentRef.destroy();
  }

  /**
   * Sets the reference to this view to be able to destroy it.
   */
  public setViewRef(componentRef: ComponentRef<NotificationsComponent>) {
    this.componentRef = componentRef;
  }
}
