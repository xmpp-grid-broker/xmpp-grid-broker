import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ErrorPageComponent} from './error-page/error-page.component';
import {HeaderComponent} from './header/header.component';
import {RouterModule} from '@angular/router';
import {CoreRoutingModule} from './core-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule
  ],
  declarations: [HeaderComponent, ErrorPageComponent],
  providers: [],
  exports: [RouterModule, HeaderComponent],
})
export class CoreModule {
}
