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
import {ModifySubscriptionComponent} from './topic-subscription/modify-subscription/modify-subscription.component';


const routes: Routes = [
  {
    path: 'topics/details/:id',
    canActivate: [XmppFeatureGuard],
    component: TopicDetailsComponent,
    children: [
      {path: '', redirectTo: 'configuration', pathMatch: 'full', data: {breadcrumb: 'Topic :id'}},
      {path: 'configuration', component: TopicDetailsConfigComponent, data: {breadcrumb: 'Configuration'}},
      {path: 'affiliations', component: TopicAffiliationsComponent, data: {breadcrumb: 'Affiliations'}},
      {path: 'subscriptions', component: TopicSubscriptionComponent, data: {breadcrumb: 'Subscriptions'}},
      {path: 'items', component: PersistedItemsComponent, data: {breadcrumb: 'Persisted Items'}},
    ],
    data: {
      breadcrumb: 'Topic :id'
    }
  },
  {
    path: 'topics/details/:id',
    canActivate: [XmppFeatureGuard],
    children: [
      {
        path: 'items/new',
        canActivate: [XmppFeatureGuard],
        component: NewPersistedItemComponent,
        data: {
          breadcrumb: 'New Persisted Item'
        }
      }, {
        path: 'subscriptions/new',
        canActivate: [XmppFeatureGuard],
        component: NewTopicSubscriptionComponent,
        data: {
          breadcrumb: 'New Subscription'
        }
      },
      {
        path: 'subscriptions/:jid/:subId',
        canActivate: [XmppFeatureGuard],
        component: ModifySubscriptionComponent,
        data: {
          breadcrumb: 'Modify Subscription :jid'
        }
      }
    ],
    data: {
      breadcrumb: 'Topic :id'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicDetailsRouterModule {
}
