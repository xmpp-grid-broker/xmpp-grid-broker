import {Component, ComponentRef} from '@angular/core';

@Component({
  selector: 'xgb-notifications',
  templateUrl: './confirm-notification.component.html',
  styleUrls: ['./confirm-notification.component.css']
})
export class ConfirmNotificationComponent {

  public title: string;
  public message: string;
  public confirmButtonLabel: string;
  public cancelButtonLabel: string;
  public resolvePromise: Promise<boolean>;

  private componentRef: ComponentRef<ConfirmNotificationComponent>;
  private resolve: (value?: (PromiseLike<boolean> | boolean)) => void;


  constructor() {
    this.resolvePromise = new Promise<boolean>((resolve) => {
      this.resolve = resolve;
    });
  }

  /**
   * Hide / destroy this notification.
   */
  public complete(isConfirmed: boolean) {
    this.resolve(isConfirmed);
    this.componentRef.destroy();
  }

  /**
   * Sets the reference to this view to be able to destroy it.
   */
  public setViewRef(componentRef: ComponentRef<ConfirmNotificationComponent>) {
    this.componentRef = componentRef;
  }
}
