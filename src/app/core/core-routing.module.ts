import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NotFoundComponent} from './not-found/not-found.component';
import {TopicOverviewModule} from '../features/topic-overview/topic-overview.module';

const routes: Routes = [
  {
    path: 'topics',
    loadChildren: () => (
      // TODO: Proper lazy loading...
      TopicOverviewModule
    )
  }, {
    path: '**',
    component: NotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}
