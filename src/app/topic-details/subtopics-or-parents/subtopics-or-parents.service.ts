import {Injectable} from '@angular/core';
import {Topic} from '../../core/models/topic';
import {TopicIteratorHelperService} from '../../topic-widgets/topic-iterator-helper.service';

@Injectable()
export class SubtopicsOrParentsService {

  constructor(private iteratorHelperService: TopicIteratorHelperService) {
  }

  public subtopics(forTopic: Topic): AsyncIterableIterator<Topic> {
    return this.iteratorHelperService.createChildTopicsIterator(forTopic.title, true);
  }

  public parents(forTopic: Topic): AsyncIterableIterator<Topic> {
    return this.iteratorHelperService.createParentsTopicsIterator(forTopic.title, true);
  }

}
