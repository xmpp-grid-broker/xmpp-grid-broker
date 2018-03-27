import {Component, OnDestroy, OnInit} from '@angular/core';
import {RootTopicService} from '../root-topic.service';
import {TopicList} from '../../../shared/topic-list/topic-list.component';


@Component({
  selector: 'app-root-topics',
  templateUrl: './root-topics.component.html'
})
export class RootTopicsComponent implements OnInit, OnDestroy {

  topicList: TopicList = new TopicList();

  constructor(private rootTopicService: RootTopicService) {
  }

  ngOnInit() {
    this.topicList.subscribe(this.rootTopicService.rootTopics());
  }

  ngOnDestroy() {
    this.topicList.unsubscribe();
  }

}
