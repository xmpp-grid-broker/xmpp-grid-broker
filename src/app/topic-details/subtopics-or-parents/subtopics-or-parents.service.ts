import {Injectable} from '@angular/core';
import {Topic} from '../../models';
import {TopicIteratorHelperService} from '../../topic-widgets';

@Injectable()
export class SubtopicsOrParentsService {

  constructor(private iteratorHelperService: TopicIteratorHelperService) {
  }

  public subtopics(forTopic: string): AsyncIterableIterator<Topic> {
    return this.iteratorHelperService.createChildTopicsIterator(forTopic, true);
  }

  public parents(forTopic: string): AsyncIterableIterator<Topic> {
    return this.iteratorHelperService.createParentsTopicsIterator(forTopic, true);
  }

}
