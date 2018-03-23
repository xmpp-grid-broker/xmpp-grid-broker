import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotFoundComponent} from './not-found/not-found.component';
import {HeaderComponent} from './header/header.component';
import {RouterModule} from '@angular/router';
import {CoreRoutingModule} from './core-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule
  ],
  declarations: [HeaderComponent, NotFoundComponent],
  exports: [RouterModule, HeaderComponent]
})
export class CoreModule {
}
