import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TopicDetailsComponent} from './topic-details.component';
import {TopicDetailsConfigComponent} from './topic-details-config/topic-details-config.component';
import {TopicAffiliationsComponent} from './topic-affiliations/topic-affiliations.component';
import {XmppFeatureGuardService as XmppFeatureGuard} from '../core/xmpp/xmpp-feature-guard.service';
import {PersistedItemsComponent} from './persisted-items/persisted-items/persisted-items.component';
import {NewPersistedItemComponent} from './persisted-items/new-persisted-item/new-persisted-item.component';
import {TopicSubscriptionComponent} from './topic-subscription/topic-subscription/topic-subscription.component';
import {NewTopicSubscriptionComponent} from './topic-subscription/new-topic-subscription/new-topic-subscription.component';


const routes: Routes = [
  {
    path: 'topics/details/:id',
    canActivate: [XmppFeatureGuard],
    component: TopicDetailsComponent,
    children: [
      {path: '', redirectTo: 'configuration', pathMatch: 'full'},
      {path: 'configuration', component: TopicDetailsConfigComponent},
      {path: 'affiliations', component: TopicAffiliationsComponent},
      {path: 'subscriptions', component: TopicSubscriptionComponent},
      {path: 'items', component: PersistedItemsComponent},
    ]
  }, {
    path: 'topics/details/:id/items/new',
    canActivate: [XmppFeatureGuard],
    component: NewPersistedItemComponent,
  }, {
    path: 'topics/details/:id/subscriptions/new',
    canActivate: [XmppFeatureGuard],
    component: NewTopicSubscriptionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicDetailsRouterModule {
}
