import {TopicListComponent} from './topic-list/topic-list.component';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [TopicListComponent],
  exports: [TopicListComponent],
})
export class TopicWidgetsModule {
}
