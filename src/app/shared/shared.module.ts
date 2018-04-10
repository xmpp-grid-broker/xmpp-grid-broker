import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListComponent} from './list/list.component';
import {ListItemComponent} from './list/list-item.component';
import {TabsComponent} from './tabs/tabs.component';
import {TabComponent} from './tabs/tab.component';
import {RouterModule} from '@angular/router';
import {ActionButtonDirective} from './action-button.directive';
import {ActionBarComponent} from './action-bar/action-bar.component';

const EXPORTED_DECLARATIONS = [
  ListComponent,
  ListItemComponent,
  TabsComponent,
  TabComponent,
  ActionButtonDirective,
  ActionBarComponent
];

@NgModule({
  imports: [RouterModule, CommonModule],
  declarations: [...EXPORTED_DECLARATIONS],
  exports: [...EXPORTED_DECLARATIONS],
})
export class SharedModule {
}
