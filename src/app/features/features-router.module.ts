import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TopicOverviewModule} from './topic-overview/topic-overview.module';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'topics',
    pathMatch: 'full'
  },
  {
    path: 'topics',
    loadChildren: () => (
      // TODO: Proper lazy loading...
      // TODO: ensure `/root` does not work....
      TopicOverviewModule
    )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRouterModule {
}
