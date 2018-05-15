import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import {NavigationService} from '../../core/navigation.service';
import {TopicOverviewService} from '../topic-overview-service/topic-overview.service';
import {XmppService} from '../../core/xmpp/xmpp.service';
import {Topic} from '../../core/models/topic';
import {IteratorListPager} from '../../shared/list/iterator-list-pager';


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
    this.xmppService.getServerTitle().then((serverTitle) => {
      this.serverTitle = serverTitle;
    });

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
