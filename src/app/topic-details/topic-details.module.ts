import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {TopicDetailsRouterModule} from './topic-details-router.module';
import { TopicDetailsComponent } from './topic-details.component';

@NgModule({
  imports: [
    CommonModule,
    TopicDetailsRouterModule,
    SharedModule,
  ],
  declarations: [TopicDetailsComponent]
})
export class TopicDetailsModule {
}
