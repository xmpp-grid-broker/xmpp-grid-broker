import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopicOverviewComponent, TopicOverviewRoutingModule, TopicOverviewService} from '.';
import {SharedModule} from '../shared';
import {TopicWidgetsModule} from '../topic-widgets';

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
