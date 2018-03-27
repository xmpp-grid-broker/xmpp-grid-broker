import {Component, Input} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {Topics} from '../../core/models/topic';

export class TopicList {
  isLoaded = false;
  hasError = false;
  errorMessage: string;
  topics: Topics;
  subscription: Subscription;

  subscribe(observable: Observable<Topics>) {
    this.unsubscribe();
    this.subscription = observable.subscribe(
      (topics: Topics) => {
        this.topics = topics;
        this.isLoaded = true;
      },
      error => {
        this.hasError = true;
        this.errorMessage = error;
      });
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}

@Component({
  selector: 'app-topics',
  templateUrl: './topic-list.component.html'
})
export class TopicListComponent {
  @Input() topicList: TopicList;
}
