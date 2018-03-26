import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from './not-found/not-found.component';
import {LoginComponent} from './login/login.component';
import {AuthenticationGuard} from './authentication-guard.service';


const routes: Routes = [

  {path: 'login', component: LoginComponent},
  {
    path: '',
    canActivate: [AuthenticationGuard],
    loadChildren: '../features/features.module#FeaturesModule'
  },
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}

