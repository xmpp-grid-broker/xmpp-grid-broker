import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopicOverviewComponent} from './topic-overview/topic-overview.component';
import {SharedModule} from '../shared/shared.module';
import {TopicOverviewRoutingModule} from './topic-overview-router.module';
import {TopicOverviewService} from './topic-overview-service/topic-overview.service';
import {TopicWidgetsModule} from '../topic-widgets/topic-widgets.module';

@NgModule({
  imports: [
    CommonModule,
    TopicOverviewRoutingModule,
    SharedModule,
    TopicWidgetsModule
  ],
  declarations: [TopicOverviewComponent],
  exports: [],
  providers: [TopicOverviewService]
})
export class TopicOverviewModule {
}
