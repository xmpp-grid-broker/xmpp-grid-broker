import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopicOverviewComponent} from './topic-overview.component';
import {SharedModule} from '../../shared/shared.module';
import {TopicOverviewRoutingModule} from './topic-overview-router.module';
import { RootTopicsComponent } from './root-topics/root-topics.component';
import { RootTopicService } from './root-topic.service';

@NgModule({
  imports: [
    CommonModule,
    TopicOverviewRoutingModule,
    SharedModule
  ],
  declarations: [TopicOverviewComponent, RootTopicsComponent],
  exports: [],
  providers: [RootTopicService]
})
export class TopicOverviewModule {
}
