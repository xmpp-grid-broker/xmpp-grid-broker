import {TopicListComponent} from './topic-list/topic-list.component';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {NgModule} from '@angular/core';
import {TopicConfigComponent} from './topic-config/topic-config.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormFieldNamePipe} from './topic-config/form-field-name.pipe';

const EXPORTED_DECLARATIONS = [TopicListComponent, TopicConfigComponent, FormFieldNamePipe];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  declarations: [...EXPORTED_DECLARATIONS],
  exports: [...EXPORTED_DECLARATIONS]
})
export class TopicWidgetsModule {
}
