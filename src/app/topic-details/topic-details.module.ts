import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared';
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
  TopicDetailsRouterModule,
  TopicSubscriptionComponent,
  TopicSubscriptionService
} from '.';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TopicWidgetsModule} from '../topic-widgets';

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
