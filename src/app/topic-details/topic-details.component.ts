import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Topic} from '../core/models/topic';
import {ErrorToString} from '../core/errors';
import {CurrentTopicDetailService} from './current-topic-detail.service';


@Component({
  selector: 'xgb-topic-details',
  templateUrl: './topic-details.component.html'
})
export class TopicDetailsComponent implements OnInit {

  topic: undefined | Topic;
  errorMessage: undefined | string;

  constructor(private route: ActivatedRoute,
              private service: CurrentTopicDetailService) {
  }

  ngOnInit() {
    const topicInUrl = this.route.snapshot.params.id;
    this.service.loadTopic(topicInUrl).then((topic) => {
      this.topic = topic;
    }).catch((err) => {
      this.errorMessage = ErrorToString(err);
    });
  }

}
