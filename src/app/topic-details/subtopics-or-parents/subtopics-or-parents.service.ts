import {Injectable} from '@angular/core';
import {Topic} from '../../core/models/topic';

@Injectable()
export class SubtopicsOrParentsService {

  constructor() {
  }

  public async* subtopics(forTopic: Topic): AsyncIterableIterator<Topic> {
    // TODO: IMPLEMENT
    // TODO: make sure leafs get an error
  }

  public async* parents(forTopic: Topic): AsyncIterableIterator<Topic> {
    // TODO: IMPLEMENT
  }

}
