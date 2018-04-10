import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ErrorPageComponent} from './core/error-page/error-page.component';
import {TopicOverviewModule} from './topic-overview/topic-overview.module';
import {TopicCreationModule} from './topic-creation/topic-creation.module';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'topics',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: ErrorPageComponent,
    data: {errorCode: '404'}
  },
];

@NgModule({
  imports: [
    TopicOverviewModule,
    TopicCreationModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

