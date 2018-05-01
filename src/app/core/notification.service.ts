import 'rxjs/add/operator/publish';
import {ComponentFactoryResolver, Injectable, ViewContainerRef} from '@angular/core';
import {NotificationsComponent} from './notifications/notifications.component';

/**
 * The Notification can be used to send notification
 * messages to the user.
 */
@Injectable()
export class NotificationService {
  private factoryResolver: ComponentFactoryResolver;
  private rootViewContainer: ViewContainerRef;

  constructor(factoryResolver: ComponentFactoryResolver) {
    this.factoryResolver = factoryResolver;
  }

  /**
   * Show the given message to the user.
   * If recoverable is false, the notification
   * cannot be dismissed.
   *
   * WARNING: Use msgIsHtml with caution! If set to true, the message
   * is rendered as raw HTML allowing XSS and other possible attacks
   * if user generated content is rendered!!
   */
  public notify(title, message, canHide = false, details?: any, msgIsHtml?: any) {
    // Dynamically generate a new component
    const factory = this.factoryResolver.resolveComponentFactory(NotificationsComponent);
    const componentRef = factory.create(this.rootViewContainer.parentInjector);

    // Populate the fields on the component
    const component = componentRef.instance;
    component.title = title;
    component.message = message;
    component.messageIsHtml = msgIsHtml || false;
    component.details = details;
    component.canHide = canHide;
    component.setViewRef(componentRef);

    // Insert the component into the DOM
    this.rootViewContainer.insert(componentRef.hostView);
  }

  /**
   * Reports an unexpected/unhandled error.
   */
  public reportError(details: any, recoverable = false) {
    if (!(details instanceof String)) {
      details = JSON.stringify(details);
    }
    const title = 'Oops, we have a problem...';
    const message = '<p>We are sorry, but an unexpected problem occurred</p>' +
      '<p>Please <a href="https://github.com/xmpp-grid-broker/xmpp-grid-broker/" target="_blank">' +
      'report this issue</a> so that we can fix it.</p>';
    this.notify(title, message, recoverable, details, true);
  }

  /**
   * sets view into which the component is inserted.
   * This should only be done once in the app module.
   */
  public setRootViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.rootViewContainer = viewContainerRef;
  }
}
