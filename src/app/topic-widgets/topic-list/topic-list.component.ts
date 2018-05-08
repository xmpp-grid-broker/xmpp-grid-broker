import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Topic, Topics} from '../../core/models/topic';

/**
 * This class abstracts the loading and error handling
 * to simplify the usage of the topic list component.
 *
 * It accepts an async iterator of topics that will be rendered.
 */
export class TopicList {
  isLoaded = false;
  hasError = false;
  errorMessage: string;
  topics: Topics = [];
  hasMore: boolean;

  private iterator: AsyncIterableIterator<Topic>;
  private errorHandler: (error: any) => string;
  private readonly PAGE_SIZE = 10;


  public useIterator(iterator: AsyncIterableIterator<Topic>) {
    this.iterator = iterator;
    this.hasMore = false;
    this.loadMore();
  }

  public useErrorMapper(errorHandler: (error: any) => string) {
    this.errorHandler = errorHandler;
  }

  public loadMore() {
    this.isLoaded = false;
    this.hasError = false;
    this.loadNextPage()
      .then((loadedTopics) => {
        this.topics.push(...loadedTopics);
        this.isLoaded = true;
      })
      .catch((error) => {
        this.hasError = true;
        this.errorMessage = this.errorHandler(error);
      });
  }

  private async loadNextPage(): Promise<Topics> {
    const unresolvedItrs = [];
    for (let i = 0; i < this.PAGE_SIZE; i++) {
      unresolvedItrs.push(this.iterator.next());
    }
    const result = [];
    const resolvedItrs = await Promise.all(unresolvedItrs);
    for (const next of resolvedItrs) {
      if (next.done) {
        this.hasMore = false;
        break;
      }
      result.push(next.value);
      this.hasMore = true;
    }

    return result;
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
