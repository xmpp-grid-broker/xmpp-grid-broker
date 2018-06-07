import {Component, ViewContainerRef} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent} from '@angular/router';

import {NotificationService} from './core';

/**
 * Root-Component of the xmpp-grid broker app.
 * Provides a router outlet and shows a loading indicator while new pages are fetched.
 */
@Component({
  selector: 'xgb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /**
   * Flag to indicate whether a route is in the process of loading
   * (eg. delayed due to authentication checks).
   * @type {boolean}
   */
  loading = true;

  constructor(notificationService: NotificationService,
              viewContainerRef: ViewContainerRef,
              private router: Router) {
    notificationService.setRootViewContainerRef(viewContainerRef);
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  /**
   * changes the loading field based on the received RouterEvent.
   * @param {RouterEvent} event
   */
  navigationInterceptor(event: RouterEvent): void {
    switch (event.constructor) {
      case NavigationStart:
        this.loading = true;
        break;
      case NavigationEnd:
      case NavigationCancel:
      case NavigationError:
        this.loading = false;
    }
  }
}
