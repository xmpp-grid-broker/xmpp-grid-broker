import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {NavigationService, XmppService} from '../../core';
import {Topic} from '../../models';
import {TopicOverviewService} from '../topic-overview-service';
import {IteratorListPager} from '../../shared';


@Component({
  selector: 'xgb-topic-overview',
  templateUrl: './topic-overview.component.html'
})
export class TopicOverviewComponent implements OnInit {

  topicList: IteratorListPager<Topic> = new IteratorListPager();

  serverTitle: string;

  constructor(private navigationService: NavigationService,
              private xmppService: XmppService,
              private topicOverviewService: TopicOverviewService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.serverTitle = this.xmppService.getServerTitle();

    let iterator: AsyncIterableIterator<Topic>;

    switch (this.route.snapshot.data.filter) {
      case 'root':
        iterator = this.topicOverviewService.rootTopics();
        break;
      case 'all':
        iterator = this.topicOverviewService.allTopics();
        break;
      case 'collections':
        iterator = this.topicOverviewService.allCollections();
        break;
    }
    this.topicList.useErrorMapper(this.mapErrors.bind(this));
    this.topicList.useIterator(iterator);
  }

  mapErrors(error: any): string {
    return `Failed to load topics / collection : ${JSON.stringify(error)}`;
  }

  createNew(what: string) {
    switch (what) {
      case 'collection':
        this.navigationService.goToNewCollection();
        break;
      default:
        this.navigationService.goToNewTopic();
    }
  }

  onTopicClicked(topic: Topic) {
    this.navigationService.goToTopic(topic);
  }
}
