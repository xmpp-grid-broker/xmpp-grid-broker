import {ErrorHandler, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ErrorPageComponent} from './error-page/error-page.component';
import {HeaderComponent} from './header/header.component';
import {RouterModule} from '@angular/router';
import {NavigationService} from './navigation.service';
import {XmppService, XmppClientFactory} from './xmpp/xmpp.service';
import {XmppFeatureService} from './xmpp/xmpp-feature.service';
import {GlobalErrorHandlerService} from './global-error-handler.service';
import {NotificationService} from './notifications/notification.service';
import {ConfigService} from './config.service';
import {XmppFeatureGuardService} from './xmpp/xmpp-feature-guard.service';
import {ConfirmNotificationComponent} from './notifications/confirm-notification/confirm-notification.component';
import {AlertNotificationComponent} from './notifications/alert-notification/alert-notification.component';


@NgModule({
  imports: [CommonModule, RouterModule, HttpClientModule],
  declarations: [HeaderComponent, ErrorPageComponent, AlertNotificationComponent, ConfirmNotificationComponent],
  exports: [HeaderComponent, AlertNotificationComponent, ConfirmNotificationComponent],
  entryComponents: [AlertNotificationComponent, ConfirmNotificationComponent],
  providers: [{
    provide: ErrorHandler,
    useClass: GlobalErrorHandlerService
  }, NotificationService, NavigationService, XmppService, XmppClientFactory, XmppFeatureService, XmppFeatureGuardService, ConfigService]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
