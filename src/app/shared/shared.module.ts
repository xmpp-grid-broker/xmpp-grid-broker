import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  ActionBarComponent,
  ActionButtonDirective,
  BreadCrumbComponent,
  CollapsibleComponent,
  FormDirective,
  FormFieldComponent,
  FormInputDirective,
  FormSwitchComponent,
  ListActionComponent,
  ListBodyComponent,
  ListComponent,
  ListItemComponent,
  NoDuplicatesAllowedDirective,
  SpinnerComponent,
  TabComponent,
  TabsComponent,
  ToastDirective
} from '.';
import {RouterModule} from '@angular/router';

const EXPORTED_DECLARATIONS = [
  ListComponent,
  ListItemComponent,
  ListActionComponent,
  ListBodyComponent,
  TabsComponent,
  TabComponent,
  ActionButtonDirective,
  ToastDirective,
  ActionBarComponent,
  FormDirective,
  FormInputDirective,
  FormSwitchComponent,
  FormFieldComponent,
  SpinnerComponent,
  CollapsibleComponent,
  NoDuplicatesAllowedDirective,
  BreadCrumbComponent
];

@NgModule({
  imports: [RouterModule, CommonModule],
  declarations: [...EXPORTED_DECLARATIONS],
  exports: [...EXPORTED_DECLARATIONS],
})
export class SharedModule {
}
