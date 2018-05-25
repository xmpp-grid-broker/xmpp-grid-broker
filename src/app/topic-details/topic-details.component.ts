import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Topic} from '../core/models/topic';
import {CurrentTopicDetailService} from './current-topic-detail.service';
import {ErrorToString} from '../core/errors';
import {Subscription} from 'rxjs/Subscription';


@Component({
  selector: 'xgb-topic-details',
  templateUrl: './topic-details.component.html'
})
export class TopicDetailsComponent implements OnInit, OnDestroy {

  topic: undefined | Topic;
  errorMessage: undefined | string;
  private paramsSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private service: CurrentTopicDetailService) {
  }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this.topic = undefined;
      const topicInUrl = params.id;
      this.service.loadTopic(topicInUrl).then((topic) => {
        this.topic = topic;
      }).catch((err) => {
        this.errorMessage = ErrorToString(err);
      });
    });
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

}
