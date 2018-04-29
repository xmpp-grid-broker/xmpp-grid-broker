import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {TopicDetailsRouterModule} from './topic-details-router.module';
import {TopicDetailsConfigComponent} from './topic-details-config/topic-details-config.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TopicDetailsService} from './topic-details.service';
import {TopicWidgetsModule} from '../topic-widgets/topic-widgets.module';
import { TopicDetailsComponent } from './topic-details/topic-details.component';

@NgModule({
  imports: [
    CommonModule,
    TopicDetailsRouterModule,
    SharedModule,
    TopicWidgetsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [TopicDetailsComponent, TopicDetailsConfigComponent],
  providers: [TopicDetailsService]
})
export class TopicDetailsModule {
}
