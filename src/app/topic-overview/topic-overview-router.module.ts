import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TopicOverviewComponent} from './topic-overview/topic-overview.component';
import {XmppFeatureGuardService as XmppFeatureGuard} from '../core/xmpp/xmpp-feature-guard.service';

const routes: Routes = [
  {
    path: 'topics',
    canActivate: [XmppFeatureGuard],
    children: [
      {path: '', redirectTo: 'root', pathMatch: 'full'},
      {path: 'root', component: TopicOverviewComponent, data: {filter: 'root'}},
      {path: 'all', component: TopicOverviewComponent, data: {filter: 'all'}},
      {path: 'collections', component: TopicOverviewComponent, data: {filter: 'collections'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicOverviewRoutingModule {
}
