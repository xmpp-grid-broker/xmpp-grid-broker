import {Component, Input} from '@angular/core';
import {Topics} from '../../core/models/topic';

/**
 * This class abstracts the loading and error handling
 * to simplify the usage of the topic list component.
 *
 * It accepts a observable of topics that will be rendered.
 * Users still must manually unsubscribe the observables
 * using the `unsubscribe` method.
 */
export class TopicList {
  isLoaded = false;
  hasError = false;
  errorMessage: string;
  topics: Topics;

  usePromise(promise: Promise<Topics>) {
    this.isLoaded = false;
    this.hasError = false;
    promise.then(
      (topics: Topics) => {
        this.topics = topics;
        this.isLoaded = true;
      },
      error => {
        this.hasError = true;
        this.errorMessage = error;
      });
  }

}

@Component({
  selector: 'xgb-topics',
  templateUrl: './topic-list.component.html'
})
export class TopicListComponent {
  @Input() topicList: TopicList;
}
