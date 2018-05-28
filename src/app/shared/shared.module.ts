import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListComponent} from './list/list.component';
import {ListItemComponent} from './list/list-item.component';
import {TabsComponent} from './tabs/tabs.component';
import {TabComponent} from './tabs/tab.component';
import {RouterModule} from '@angular/router';
import {ActionButtonDirective} from './action-button.directive';
import {ActionBarComponent} from './action-bar/action-bar.component';
import {FormDirective} from './form/form.directive';
import {FormInputDirective} from './form/form-input.directive';
import {FormSwitchComponent} from './form/form-switch.component';
import {FormFieldComponent} from './form/form-field.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {CollapsibleComponent} from './collapsible/collapsible.component';
import {ToastDirective} from './toast.directive';
import {NoDuplicatesAllowedDirective} from './form/no-duplicates-allowed.directive';
import {ListActionComponent} from './list/list-action.component';
import {ListBodyComponent} from './list/list-body.component';
import {BreadCrumbComponent} from './bread-crumb/bread-crumb.component';

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
