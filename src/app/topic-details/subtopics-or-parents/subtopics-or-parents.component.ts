import {Component, OnInit} from '@angular/core';
import {CurrentTopicDetailService} from '../current-topic-detail.service';
import {Topic} from '../../core/models/topic';
import {ActivatedRoute} from '@angular/router';
import {IteratorListPager} from '../../shared/list/iterator-list-pager';
import {NavigationService} from '../../core/navigation.service';
import {SubtopicsOrParentsService} from './subtopics-or-parents.service';

@Component({
  selector: 'xgb-subtopics-or-parents',
  templateUrl: './subtopics-or-parents.component.html'
})
export class SubtopicsOrParentsComponent implements OnInit {

  iterator = new IteratorListPager();
  topic: Topic;

  constructor(private route: ActivatedRoute,
              private navigationService: NavigationService,
              private service: SubtopicsOrParentsService,
              private detailsService: CurrentTopicDetailService) {
  }

  ngOnInit() {
    this.topic = this.detailsService.currentTopic();
    if (this.route.snapshot.data.subtopics) {
      this.iterator.useIterator(this.service.subtopics(this.topic));
    } else {
      this.iterator.useIterator(this.service.parents(this.topic));
    }

  }

  onTopicClicked(topic: Topic) {
    this.navigationService.goToTopic(topic);
  }
}
