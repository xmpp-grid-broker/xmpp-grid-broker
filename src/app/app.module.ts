import {SharedModule} from './shared/shared.module';
import {CoreModule} from './core/core.module';
import {AppComponent} from './app.component';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, UrlSerializer} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {CustomUrlSerializer} from './custom-url-serializer';

/**
 * Root-Module of the XMPP-Grid Broker App.
 */
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    CoreModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [{provide: UrlSerializer, useClass: CustomUrlSerializer}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
