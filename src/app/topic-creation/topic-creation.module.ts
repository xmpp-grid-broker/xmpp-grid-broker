import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared';
import {TopicWidgetsModule} from '../topic-widgets';
import {TopicCreationComponent, TopicCreationRoutingModule, TopicCreationService} from '.';
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
