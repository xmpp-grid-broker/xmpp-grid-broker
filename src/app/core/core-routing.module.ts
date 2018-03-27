import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ErrorPageComponent} from './error-page/error-page.component';


const routes: Routes = [

  {
    path: '',
    canActivate: [],
    loadChildren: '../features/features.module#FeaturesModule'
  },
  {path: '**', component: ErrorPageComponent, data: {errorCode: '404'}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}

