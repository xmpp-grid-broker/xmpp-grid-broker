import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {TopicWidgetsModule} from '../topic-widgets/topic-widgets.module';
import {TopicCreationComponent, TopicCreationService} from '.';
import {TopicCreationRoutingModule} from './topic-creation-router.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TopicCreationRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TopicWidgetsModule
  ],
  declarations: [TopicCreationComponent],
  exports: [],
  providers: [TopicCreationService]
})
export class TopicCreationModule {
}
