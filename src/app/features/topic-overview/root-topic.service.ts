import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import {Topics} from '../../core/models/topic';
import {Observer} from 'rxjs/Observer';


@Injectable()
export class RootTopicService {

  constructor() {
  }

  rootTopics(): Observable<Topics> {
    return Observable.of([]).delay(1000);
    // return Observable.create((observer: Observer<Topics>) => {
    //   setTimeout(() => {
    //     observer.next([]);
    //
    //   }, 2000);
    //   setTimeout(() => {
    //     observer.error('oh no!');
    //   }, 4000);
    // });
  }
}
