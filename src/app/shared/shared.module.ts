import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListComponent} from './list/list.component';
import {ListItemComponent} from './list/list-item.component';
import {TabsComponent} from './tabs/tabs.component';
import {TabComponent} from './tabs/tab.component';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [RouterModule, CommonModule],
  declarations: [ListComponent, ListItemComponent, TabsComponent, TabComponent],
  exports: [ListComponent, ListItemComponent, TabsComponent, TabComponent],
})
export class SharedModule {
}
