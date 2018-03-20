import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabViewComponent} from './shared/layouts/tab-view/tab-view.component';
import {NotFoundComponent} from './not-found/not-found.component';


const routes: Routes = [

  {
    path: '', component: TabViewComponent,
    //   children: [
    //     {path: '', component: null},
    // ]
  },
  {path: '**', redirectTo: '/404'},
  {path: '404', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
