import {ErrorHandler, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {
  AlertNotificationComponent,
  ConfigLoaderService,
  ConfirmNotificationComponent,
  ErrorLogService,
  ErrorPageComponent,
  GlobalErrorHandlerService,
  NavigationService,
  NotificationService,
  XmppClientFactory,
  XmppFeatureGuardService,
  XmppFeatureService,
  XmppService
} from '.';
import {RouterModule} from '@angular/router';
import {BreadCrumbComponent, HeaderComponent} from './index';

const EXPORTED_DECLARATIONS = [
  HeaderComponent,
  BreadCrumbComponent,
  AlertNotificationComponent,
  ConfirmNotificationComponent
];

@NgModule({
  imports: [CommonModule, RouterModule, HttpClientModule],
  declarations: [
    ...EXPORTED_DECLARATIONS,
    ErrorPageComponent
  ],
  exports: [
    ...EXPORTED_DECLARATIONS
  ],
  entryComponents: [
    AlertNotificationComponent,
    ConfirmNotificationComponent
  ],
  providers: [
    {provide: ErrorHandler, useClass: GlobalErrorHandlerService},
    NotificationService,
    NavigationService,
    XmppService,
    XmppClientFactory,
    XmppFeatureService,
    XmppFeatureGuardService,
    ConfigLoaderService,
    ErrorLogService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
