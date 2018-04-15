import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Topics} from '../../core/models/topic';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import {XmppService} from '../../core/xmpp/xmpp.service';

@Injectable()
export class TopicService {

  private items = [
    {
      title: 'Root #1', children: [
        {
          title: 'Child #1',
        },
        {
          title: 'Child #2',
          children: [{title: 'SubChild #1'}]
        }
      ]
    },
    {title: 'Root #2', children: []}
  ];

  constructor(private xmppService: XmppService) {
  }

  rootTopics(): Observable<Topics> {
    // this.xmppService.createNode('testnode');
    return this.xmppService.getTopics();
  }

  allTopics(): Observable<Topics> {
    return Observable.of(this.flatItems().filter((it) => it.children === undefined)).delay(300);
  }

  allCollections(): Observable<Topics> {
    return Observable.of(this.flatItems().filter((it) => it.children !== undefined)).delay(300);
  }

  getServerTitle(): Promise<string> {
    // TODO: cache this in the "real" implementation...
    return Observable.of('xmpp.hsr.ch').delay(100).toPromise();
  }

  private flatItems(): any[] {
    const result = [];
    this.flatten(this.items, result);
    return result;
  }


  private flatten(data, result) {
    if (data === undefined) {
      return;
    }
    result.push(...data);
    data.forEach((it) => {
      this.flatten(it.children, result);
    });
  }

}
