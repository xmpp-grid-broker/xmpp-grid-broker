import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {TopicWidgetsModule} from '../topic-widgets/topicWidgets.module';
import {TopicCreationComponent} from './topic-creation/topic-creation.component';
import {TopicCreationRoutingModule} from './topic-creation-router.module';
import { TopicCreationService } from './topic-creation.service';

@NgModule({
  imports: [
    CommonModule,
    TopicCreationRoutingModule,
    SharedModule,
    TopicWidgetsModule
  ],
  declarations: [TopicCreationComponent],
  exports: [],
  providers: [TopicCreationService]
})
export class TopicCreationModule {
}
