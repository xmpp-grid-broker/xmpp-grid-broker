import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutsModule} from './layouts/layouts.module';
import {ListComponent} from './list/list.component';
import {ListItemComponent} from './list/list-item/list-item.component';
import {TopicListComponent} from './topic-list/topic-list.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutsModule
  ],
  declarations: [ListComponent, ListItemComponent, TopicListComponent],
  exports: [LayoutsModule, TopicListComponent],
})
export class SharedModule {
}
