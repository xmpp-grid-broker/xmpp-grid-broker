import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TopicOverviewComponent} from './topic-overview.component';
import {RootTopicsComponent} from './root-topics/root-topics.component';


const routes: Routes = [
  {
    path: '',
    component: TopicOverviewComponent,
    children: [
      {path: '', redirectTo: 'root', pathMatch: 'full'},
      {path: 'root', component: RootTopicsComponent},
      {path: 'all', component: RootTopicsComponent},
      {path: 'collections', component: RootTopicsComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicOverviewRoutingModule {
}
