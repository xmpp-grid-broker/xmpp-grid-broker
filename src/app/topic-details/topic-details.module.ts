import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {
  CurrentTopicDetailService,
  ModifySubscriptionComponent,
  NewPersistedItemComponent,
  NewTopicSubscriptionComponent,
  PersistedItemsComponent,
  PersistedItemsService,
  SubtopicsOrParentsComponent,
  SubtopicsOrParentsService,
  TopicAffiliationsComponent,
  TopicAffiliationsService,
  TopicDetailsComponent,
  TopicDetailsConfigComponent,
  TopicDetailsConfigurationService,
  TopicSubscriptionComponent,
  TopicSubscriptionService
} from '.';
import {TopicDetailsRouterModule} from './topic-details-router.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TopicWidgetsModule} from '../topic-widgets/topic-widgets.module';

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
    ModifySubscriptionComponent,
    SubtopicsOrParentsComponent
  ],
  providers: [
    TopicDetailsConfigurationService,
    CurrentTopicDetailService,
    TopicAffiliationsService,
    PersistedItemsService,
    TopicSubscriptionService,
    SubtopicsOrParentsService]
})
export class TopicDetailsModule {
}
