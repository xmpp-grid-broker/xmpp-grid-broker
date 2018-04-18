import {Component, OnDestroy, OnInit} from '@angular/core';
import {TopicList} from '../../topic-widgets/topic-list/topic-list.component';
import {ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import {NavigationService} from '../../core/navigation.service';
import {TopicOverviewService} from '../topic-overview-service/topic-overview.service';
import {XmppService} from '../../core/xmpp/xmpp.service';


@Component({
  selector: 'xgb-topic-overview',
  templateUrl: './topic-overview.component.html'
})
export class TopicOverviewComponent implements OnInit, OnDestroy {

  topicList: TopicList = new TopicList();

  serverTitle: string;

  constructor(private navigationService: NavigationService,
              private xmppService: XmppService,
              private topicOverviewService: TopicOverviewService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.xmppService.getServerTitle().then((serverTitle) => {
      this.serverTitle = serverTitle;
    });
    let subscription;

    switch (this.route.snapshot.data.filter) {
      case 'root':
        subscription = this.topicOverviewService.rootTopics();
        break;
      case 'all':
        subscription = this.topicOverviewService.allTopics();
        break;
      case 'collections':
        subscription = this.topicOverviewService.allCollections();
        break;
    }
    this.topicList.subscribe(subscription);
  }

  ngOnDestroy() {
    this.topicList.unsubscribe();
  }

  createNewTopic() {
    this.navigationService.goToNewTopic();
  }
}
