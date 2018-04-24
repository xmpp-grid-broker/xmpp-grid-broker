import {TopicListComponent} from './topic-list/topic-list.component';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {NgModule} from '@angular/core';
import {GenericFormConfigComponent} from './generic-form-config/generic-form-config.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormFieldNamePipe} from './generic-form-config/form-field-name.pipe';
import {JidMultiComponent} from './jid-multi/jid-multi.component';
import {TopicChooserComponent} from './topic-chooser/topic-chooser.component';

const EXPORTED_DECLARATIONS = [TopicListComponent, GenericFormConfigComponent, FormFieldNamePipe, TopicChooserComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  declarations: [...EXPORTED_DECLARATIONS, JidMultiComponent],
  exports: [...EXPORTED_DECLARATIONS]
})
export class TopicWidgetsModule {
}
