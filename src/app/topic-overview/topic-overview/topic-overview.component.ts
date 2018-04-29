import {Component, OnInit} from '@angular/core';
import {TopicList} from '../../topic-widgets/topic-list/topic-list.component';
import {ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import {NavigationService} from '../../core/navigation.service';
import {TopicOverviewService} from '../topic-overview-service/topic-overview.service';
import {XmppService} from '../../core/xmpp/xmpp.service';
import {Topic} from '../../core/models/topic';


@Component({
  selector: 'xgb-topic-overview',
  templateUrl: './topic-overview.component.html'
})
export class TopicOverviewComponent implements OnInit {

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
    // TODO: support all categories
    // let promise: Promise<Paged<Topic>>;

    // switch (this.route.snapshot.data.filter) {
    //   case 'root':
    //     promise = this.topicOverviewService.rootTopics();
    //     break;
      // TODO: FIX TYPES
      // case 'all':
      //   promise = this.topicOverviewService.allTopics();
      //   break;
      // case 'collections':
      //   promise = this.topicOverviewService.allCollections();
      //   break;
    // }
    this.topicList.useLoader(this.topicOverviewService.rootTopics.bind(this.topicOverviewService));
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
