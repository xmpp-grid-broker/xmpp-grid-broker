import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TopicDetailsComponent} from './topic-details/topic-details.component';
import {TopicDetailsConfigComponent} from './topic-details-config/topic-details-config.component';
import {TopicAffiliationsComponent} from './topic-affiliations/topic-affiliations.component';
import {XmppFeatureGuardService as XmppFeatureGuard} from '../core/xmpp/xmpp-feature-guard.service';
import {PersistedItemsComponent} from './persisted-items/persisted-items.component';


const routes: Routes = [
  {
    path: 'topics/details/:id',
    canActivate: [XmppFeatureGuard],
    component: TopicDetailsComponent,
    children: [
      {path: '', redirectTo: 'configuration', pathMatch: 'full'},
      {path: 'configuration', component: TopicDetailsConfigComponent},
      {path: 'affiliations', component: TopicAffiliationsComponent},
      {path: 'items', component: PersistedItemsComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicDetailsRouterModule {
}
