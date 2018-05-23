import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {TopicDetailsRouterModule} from './topic-details-router.module';
import {TopicDetailsConfigComponent} from './topic-details-config/topic-details-config.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TopicDetailsConfigurationService} from './topic-details-config/topic-details-configuration.service';
import {TopicWidgetsModule} from '../topic-widgets/topic-widgets.module';
import {TopicDetailsComponent} from './topic-details.component';
import {TopicAffiliationsComponent} from './topic-affiliations/topic-affiliations.component';
import {PersistedItemsComponent} from './persisted-items/persisted-items/persisted-items.component';
import {PersistedItemsService} from './persisted-items/persisted-items.service';
import {NewPersistedItemComponent} from './persisted-items/new-persisted-item/new-persisted-item.component';
import {TopicSubscriptionComponent} from './topic-subscription/topic-subscription/topic-subscription.component';
import {TopicSubscriptionService} from './topic-subscription/topic-subscription.service';
import {NewTopicSubscriptionComponent} from './topic-subscription/new-topic-subscription/new-topic-subscription.component';
import { ModifySubscriptionComponent } from './topic-subscription/modify-subscription/modify-subscription.component';
import {CurrentTopicDetailService} from './current-topic-detail.service';
import {TopicAffiliationsService} from './topic-affiliations/topic-affiliations.service';

@NgModule({
  imports: [
    CommonModule,
    TopicDetailsRouterModule,
    SharedModule,
    TopicWidgetsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    TopicDetailsComponent,
    TopicDetailsConfigComponent,
    TopicAffiliationsComponent,
    PersistedItemsComponent,
    NewPersistedItemComponent,
    TopicSubscriptionComponent,
    NewTopicSubscriptionComponent,
    ModifySubscriptionComponent
  ],
  providers: [
    TopicDetailsConfigurationService,
    CurrentTopicDetailService,
    TopicAffiliationsService,
    PersistedItemsService,
    TopicSubscriptionService]
})
export class TopicDetailsModule {
}
