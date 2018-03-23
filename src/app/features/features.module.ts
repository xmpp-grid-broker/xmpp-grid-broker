import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopicOverviewModule} from './topic-overview/topic-overview.module';
import {FeaturesRouterModule} from './features-router.module';

@NgModule({
  imports: [
    CommonModule,
    FeaturesRouterModule,
    TopicOverviewModule,
  ],
  declarations: [],
  exports: [TopicOverviewModule]
})
export class FeaturesModule {
}
