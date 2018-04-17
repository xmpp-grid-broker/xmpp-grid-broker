import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {TopicWidgetsModule} from '../topic-widgets/topic-widgets.module';
import {TopicCreationComponent} from './topic-creation/topic-creation.component';
import {TopicCreationRoutingModule} from './topic-creation-router.module';
import {TopicCreationService} from './topic-creation.service';
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
