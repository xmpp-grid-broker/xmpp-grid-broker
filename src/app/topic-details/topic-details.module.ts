import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {TopicDetailsRouterModule} from './topic-details-router.module';
import {TopicDetailsComponent} from './topic-details.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TopicDetailsService} from './topic-details.service';
import {TopicWidgetsModule} from '../topic-widgets/topic-widgets.module';

@NgModule({
  imports: [
    CommonModule,
    TopicDetailsRouterModule,
    SharedModule,
    TopicWidgetsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [TopicDetailsComponent],
  providers: [TopicDetailsService]
})
export class TopicDetailsModule {
}
