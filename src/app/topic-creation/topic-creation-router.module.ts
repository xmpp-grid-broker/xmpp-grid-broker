import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TopicCreationComponent} from './topic-creation/topic-creation.component';


const routes: Routes = [
  {
    path: 'topics/new', component: TopicCreationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicCreationRoutingModule {
}
