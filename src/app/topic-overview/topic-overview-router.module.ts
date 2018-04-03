import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TopicOverviewComponent} from './topic-overview/topic-overview.component';


const routes: Routes = [
  {
    path: 'topics', children: [
      {path: '', redirectTo: 'root', pathMatch: 'full'},
      {path: 'root', component: TopicOverviewComponent},
      {path: 'all', component: TopicOverviewComponent},
      {path: 'collections', component: TopicOverviewComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicOverviewRoutingModule {
}
