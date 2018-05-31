import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopicOverviewComponent, TopicOverviewService} from '.';
import {TopicOverviewRoutingModule} from './topic-overview-router.module';
import {SharedModule} from '../shared/shared.module';
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
