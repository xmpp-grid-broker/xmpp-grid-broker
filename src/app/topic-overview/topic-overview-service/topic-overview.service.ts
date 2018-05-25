import {Injectable} from '@angular/core';
import {CollectionTopic, LeafTopic, Topic} from '../../core/models/topic';
import {TopicIteratorHelperService} from '../../topic-widgets/topic-iterator-helper.service';

@Injectable()
export class TopicOverviewService {

  constructor(private iteratorHelperService: TopicIteratorHelperService) {
  }

  public rootTopics(): AsyncIterableIterator<Topic> {
    return this.iteratorHelperService.createTopicsIterator(undefined, false);
  }

  public allTopics(): AsyncIterableIterator<Topic> {
    return this.iteratorHelperService.createFilterTopicsIterator(undefined, (value) => value instanceof LeafTopic);
  }

  public allCollections(): AsyncIterableIterator<Topic> {
    return this.iteratorHelperService.createFilterTopicsIterator(undefined, (value) => value instanceof CollectionTopic);
  }

}
