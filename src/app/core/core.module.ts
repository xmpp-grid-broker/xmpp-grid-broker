import {ErrorHandler, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ErrorPageComponent} from './error-page/error-page.component';
import {HeaderComponent} from './header/header.component';
import {RouterModule} from '@angular/router';
import {NavigationService} from './navigation.service';
import {XmppService, XmppClientFactory} from './xmpp/xmpp.service';
import {GlobalErrorHandlerService} from './global-error-handler.service';
import {NotificationService} from './notification.service';
import {NotificationsComponent} from './notifications/notifications.component';


@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [HeaderComponent, ErrorPageComponent, NotificationsComponent],
  exports: [HeaderComponent, NotificationsComponent],
  entryComponents: [NotificationsComponent],
  providers: [{
    provide: ErrorHandler,
    useClass: GlobalErrorHandlerService
  }, NotificationService, NavigationService, XmppService, XmppClientFactory]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
