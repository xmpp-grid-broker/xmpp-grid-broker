import {Component, Input} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
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
  subscription: Subscription;

  /**
   * subscribe to the given topic so that it
   * is updated when receiving new items / errors.
   * @param {Observable<Topics>} observable
   */
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
  selector: 'xgb-topics',
  templateUrl: './topic-list.component.html'
})
export class TopicListComponent {
  @Input() topicList: TopicList;
}
