import {
  FormFieldNamePipe,
  GenericFormConfigComponent,
  JidMultiComponent,
  TopicChooserComponent,
  TopicConfigComponent,
  TopicIteratorHelperService,
  TopicListComponent
} from '.';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const EXPORTED_DECLARATIONS = [
  TopicListComponent,
  GenericFormConfigComponent,
  TopicConfigComponent,
  FormFieldNamePipe,
  TopicChooserComponent
];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  declarations: [...EXPORTED_DECLARATIONS, JidMultiComponent],
  exports: [...EXPORTED_DECLARATIONS],
  providers: [TopicIteratorHelperService]

})
export class TopicWidgetsModule {
}
