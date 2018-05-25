import {Injectable} from '@angular/core';
import {Topic} from '../../core/models/topic';
import {TopicIteratorHelperService} from '../../topic-widgets/topic-iterator-helper.service';

@Injectable()
export class SubtopicsOrParentsService {

  constructor(private iteratorHelperService: TopicIteratorHelperService) {
  }

  public subtopics(forTopic: Topic): AsyncIterableIterator<Topic> {
    return this.iteratorHelperService.createTopicsIterator(forTopic.title, true);
  }

  public async* parents(forTopic: Topic): AsyncIterableIterator<Topic> {
    // TODO: IMPLEMENT -> if possible, use the same mechanism as above
  }

}
