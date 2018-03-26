import {FeaturesModule} from './features/features.module';
import {SharedModule} from './shared/shared.module';
import {CoreModule} from './core/core.module';
import {AppComponent} from './app.component';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

/**
 * Root-Module of the XMPP-Grid Broker App.
 */
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    FeaturesModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  title: 'XMPP-Grid Broker';
}
