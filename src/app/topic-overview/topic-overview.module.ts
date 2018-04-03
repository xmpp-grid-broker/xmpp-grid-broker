import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopicOverviewComponent} from './topic-overview/topic-overview.component';
import {SharedModule} from '../shared/shared.module';
import {TopicOverviewRoutingModule} from './topic-overview-router.module';
import {TopicService} from './topic-service/topic.service';
import {TopicWidgetsModule} from '../topic-widgets/topicWidgets.module';

@NgModule({
  imports: [
    CommonModule,
    TopicOverviewRoutingModule,
    SharedModule,
    TopicWidgetsModule
  ],
  declarations: [TopicOverviewComponent],
  exports: [],
  providers: [TopicService]
})
export class TopicOverviewModule {
}
