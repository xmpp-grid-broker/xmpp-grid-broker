import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotFoundComponent} from './not-found/not-found.component';
import {HeaderComponent} from './header/header.component';
import {RouterModule} from '@angular/router';
import {CoreRoutingModule} from './core-routing.module';
import {LoginComponent} from './login/login.component';
import {AuthenticationGuard} from './authentication-guard.service';
import {AuthenticationService} from './authentication.service';

@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule
  ],
  declarations: [HeaderComponent, NotFoundComponent, LoginComponent],
  providers: [AuthenticationService, AuthenticationGuard],
  exports: [RouterModule, HeaderComponent],
})
export class CoreModule {
}
