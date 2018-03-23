import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutsModule} from './layouts/layouts.module';
import {ListComponent} from './list/list.component';
import {ListItemComponent} from './list/list-item/list-item.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutsModule
  ],
  declarations: [ListComponent, ListItemComponent],
  exports: [LayoutsModule, ListComponent, ListItemComponent],
})
export class SharedModule {
}
