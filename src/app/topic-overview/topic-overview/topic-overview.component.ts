import {Component, OnDestroy, OnInit} from '@angular/core';
import {TopicList} from '../../topic-widgets/topic-list/topic-list.component';
import {TopicService} from '../topic-service/topic.service';
import {ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';


@Component({
  selector: 'xgb-topic-overview',
  templateUrl: './topic-overview.component.html'
})
export class TopicOverviewComponent implements OnInit, OnDestroy {

  topicList: TopicList = new TopicList();

  serverTitle: string;

  constructor(private topicService: TopicService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.topicService.getServerTitle().then((serverTitle) => {
      this.serverTitle = serverTitle;
    });
    let subscription;

    switch (this.route.snapshot.data.filter) {
      case 'root':
        subscription = this.topicService.rootTopics();
        break;
      case 'all':
        subscription = this.topicService.allTopics();
        break;
      case 'collections':
        subscription = this.topicService.allCollections();
        break;
    }
    this.topicList.subscribe(subscription);
  }

  ngOnDestroy() {
    this.topicList.unsubscribe();
  }

}
