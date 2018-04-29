import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Topic, Topics} from '../../core/models/topic';
import {Paged} from '../../topic-overview/topic-overview-service/topic-overview.service';

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
  topics: Topics = [];
  page: Paged<Topic>;
  private loader: (nextKey: string) => Promise<Paged<Topic>>;


  public useLoader(load: (string) => Promise<Paged<Topic>>) {
    this.loader = load;
    this.loadPage(undefined);
  }

  public loadMore() {
    this.loadPage(this.page.nextKey);
  }

  private loadPage(nextKey: string) {
    this.isLoaded = false;
    this.hasError = false;
    this.loader(nextKey).then(
      (page: Paged<Topic>) => {
        this.page = page;
        this.topics.push(...page.items);
        this.isLoaded = true;
        // TODO: get rid of "magic" nuber -> set this on the page directly!
      },
      error => {
        this.hasError = true;
        // TODO: BETTER ERROR HANDLING (ERROR IS OBJECT
        console.log(error);
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
  @Output() topicClicked = new EventEmitter<Topic>();

  topicClick(node: Topic) {
    this.topicClicked.next(node);
  }

}
