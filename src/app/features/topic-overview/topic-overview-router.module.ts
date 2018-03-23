import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TopicOverviewComponent} from './topic-overview.component';


const routes: Routes = [
  {
    path: '',
    // redirectTo: 'topics',
    // pathMatch: 'full'
  // },
  // {
  //   path: 'topic',
    component: TopicOverviewComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicOverviewRoutingModule {
}
