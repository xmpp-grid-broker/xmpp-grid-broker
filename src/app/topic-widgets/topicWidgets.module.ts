import {TopicListComponent} from './topic-list/topic-list.component';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {NgModule} from '@angular/core';
import {TopicConfigComponent} from './topic-config/topic-config.component';
import {FormsModule} from '@angular/forms';

const EXPORTED_DECLARATIONS = [TopicListComponent, TopicConfigComponent];

@NgModule({
  imports: [CommonModule, FormsModule, SharedModule],
  declarations: [...EXPORTED_DECLARATIONS],
  exports: [...EXPORTED_DECLARATIONS]
})
export class TopicWidgetsModule {
}
