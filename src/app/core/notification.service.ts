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
   */
  public notify(message: string) {
    // Dynamically generate a new component
    const factory = this.factoryResolver.resolveComponentFactory(NotificationsComponent);
    const componentRef = factory.create(this.rootViewContainer.parentInjector);

    // Populate the fields on the component
    const component = componentRef.instance;
    component.errorMessage = message;
    component.setViewRef(componentRef);

    // Insert the component into the DOM
    this.rootViewContainer.insert(componentRef.hostView);
  }

  /**
   * sets view into which the component is inserted.
   * This should only be done once in the app module.
   */
  public setRootViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.rootViewContainer = viewContainerRef;
  }
}
