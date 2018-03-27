import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TabComponent} from './tabs/tab.component';
import {TabsComponent} from './tabs/tabs.component';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [TabComponent, TabsComponent],
  exports: [TabComponent, TabsComponent]

})
export class LayoutsModule {
}
