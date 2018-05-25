import {Injectable} from '@angular/core';
import {Topic} from '../../core/models/topic';

@Injectable()
export class SubtopicsOrParentsService {

  constructor() {
  }

  public async* subtopics(forTopic: Topic): AsyncIterableIterator<Topic> {
    // TODO: IMPLEMENT -> move the paging logic of the overview service in a utility class that can reused
    // TODO: make sure leafs get an error
  }

  public async* parents(forTopic: Topic): AsyncIterableIterator<Topic> {
    // TODO: IMPLEMENT -> if possible, use the same mechanism as above
  }

}
