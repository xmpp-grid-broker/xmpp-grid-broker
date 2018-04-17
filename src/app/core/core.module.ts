import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ErrorPageComponent} from './error-page/error-page.component';
import {HeaderComponent} from './header/header.component';
import {RouterModule} from '@angular/router';
import {NavigationService} from './navigation.service';
import {XmppService, XmppClientFactory} from './xmpp/xmpp.service';


@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [HeaderComponent, ErrorPageComponent],
  exports: [HeaderComponent],
  providers: [NavigationService, XmppService, XmppClientFactory],
  providers: [XmppService, XmppClientFactory],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
