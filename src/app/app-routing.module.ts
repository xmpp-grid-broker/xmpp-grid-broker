import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ErrorPageComponent} from './core/error-page/error-page.component';
import {TopicOverviewModule} from './topic-overview/topic-overview.module';
import {TopicCreationModule} from './topic-creation/topic-creation.module';
import {TopicDetailsModule} from './topic-details/topic-details.module';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'topics',
    pathMatch: 'full',
    data: {
      breadcrumb: 'Root'
    }
  },
  {
    path: '**',
    component: ErrorPageComponent,
    data: {
      errorCode: '404',
      breadcrumb: '404 Not Found'
    }
  },
];

@NgModule({
  imports: [
    TopicOverviewModule,
    TopicCreationModule,
    TopicDetailsModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

