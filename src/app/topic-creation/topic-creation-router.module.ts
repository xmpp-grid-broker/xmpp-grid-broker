import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TopicCreationComponent} from './topic-creation/topic-creation.component';
import {XmppFeatureGuardService as XmppFeatureGuard} from '../core/xmpp/xmpp-feature-guard.service';


const routes: Routes = [
  {
    path: 'topics/new',
    canActivate: [XmppFeatureGuard],
    children: [
      {
        path: 'topic', component: TopicCreationComponent, data: {type: 'leaf'}
      },
      {
        path: 'collection', component: TopicCreationComponent, data: {type: 'collection'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicCreationRoutingModule {
}
