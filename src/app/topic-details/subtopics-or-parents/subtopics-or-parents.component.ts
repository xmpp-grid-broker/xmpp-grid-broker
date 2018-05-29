import {Component, OnInit} from '@angular/core';
import {CurrentTopicDetailService, SubtopicsOrParentsService} from '..';
import {NavigationService, Topic} from '../../core';
import {ActivatedRoute} from '@angular/router';
import {IteratorListPager} from '../../shared';

@Component({
  selector: 'xgb-subtopics-or-parents',
  templateUrl: './subtopics-or-parents.component.html'
})
export class SubtopicsOrParentsComponent implements OnInit {

  iterator = new IteratorListPager<Topic>();
  topic: Topic;

  constructor(private route: ActivatedRoute,
              private navigationService: NavigationService,
              private service: SubtopicsOrParentsService,
              private detailsService: CurrentTopicDetailService) {
  }

  ngOnInit() {
    this.topic = this.detailsService.currentTopic();
    if (this.route.snapshot.data.subtopics) {
      this.iterator.useIterator(this.service.subtopics(this.topic.title));
    } else {
      this.iterator.useIterator(this.service.parents(this.topic.title));
    }

  }

  onTopicClicked(topic: Topic) {
    this.navigationService.goToTopic(topic);
  }
}
