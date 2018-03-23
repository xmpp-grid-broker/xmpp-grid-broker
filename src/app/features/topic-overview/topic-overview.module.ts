import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopicOverviewComponent} from './topic-overview.component';
import {SharedModule} from '../../shared/shared.module';
import {TopicOverviewRoutingModule} from './topic-overview-router.module';

@NgModule({
  imports: [
    CommonModule,
    TopicOverviewRoutingModule,
    SharedModule
  ],
  declarations: [TopicOverviewComponent],
  exports: []
})
export class TopicOverviewModule {
}
