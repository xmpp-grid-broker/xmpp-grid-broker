import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NotFoundComponent} from './not-found/not-found.component';
import {TopicOverviewModule} from '../features/topic-overview/topic-overview.module';
import {FeaturesModule} from '../features/features.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => (
      // TODO: Proper lazy loading...
      FeaturesModule
    )
  }, {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}
