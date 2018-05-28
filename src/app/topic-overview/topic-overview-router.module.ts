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
      {path: 'root', component: TopicOverviewComponent, data: {filter: 'root', breadcrumb: 'Root Topics'}},
      {path: 'all', component: TopicOverviewComponent, data: {filter: 'all', breadcrumb: 'All Topics'}},
      {path: 'collections', component: TopicOverviewComponent, data: {filter: 'collections', breadcrumb: 'All Collections'}}
    ],
    data: {
      breadcrumb: null
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicOverviewRoutingModule {
}
