import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TabItemComponent} from './tab-view/tab-item.component';
import {TabViewComponent} from './tab-view/tab-view.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TabItemComponent, TabViewComponent],
  exports: [TabItemComponent, TabViewComponent]

})
export class LayoutsModule {
}
