import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopicOverviewModule} from './topic-overview/topic-overview.module';

@NgModule({
  imports: [
    CommonModule,
    TopicOverviewModule
  ],
  declarations: [],
  exports: [TopicOverviewModule]
})
export class FeaturesModule {
}
