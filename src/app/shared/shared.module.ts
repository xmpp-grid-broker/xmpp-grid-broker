import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutsModule} from './layouts/layouts.module';

@NgModule({
  imports: [
    CommonModule,
    LayoutsModule
  ],
  exports: [LayoutsModule],
  declarations: [],
})
export class SharedModule {
}
