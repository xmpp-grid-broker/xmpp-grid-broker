import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Topic, Topics, Collection, Leaf} from '../../core/models/topic';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeAll';
import 'rxjs/add/operator/expand';
import {XmppService} from '../../core/xmpp/xmpp.service';
import {JID} from 'stanza.io';

@Injectable()
export class TopicService {
  readonly jid: any;

  constructor(private xmppService: XmppService) {
    this.jid = new JID(`pubsub.${xmppService.jid.domain}`)
  }

  private getTopicByName(name: string, loadChildren = false): Observable<Topic> {
    return this.xmppService.query((client, observer) => {
      client.getDiscoInfo(this.jid, name, (err?: any, data?: any) => {
        if(err != null) {
          observer.error(err);
          return;
        }

        const title = data.discoInfo.node;
        const topic_type = data.discoInfo.identities[0]['type'];

        if (topic_type === 'leaf') {
          observer.next(new Leaf(title));
          observer.complete();
        }

        else if (topic_type === 'collection' && loadChildren ) {
          this.getTopics(title)
            .reduce((topics: Topics, topic: Topic) => topics.concat([topic]), [])
            .subscribe((topics) => {
              observer.next(new Collection(title, topics));
              observer.complete();
            }
            );
        }

        else if (topic_type === 'collection') {
          observer.next(new Collection(title));
          observer.complete();
        }

        else {
          observer.error(`XMPP: Unsupported PubSub type "${topic_type}"`);
        }
      });
    });
  }

  private getTopics(parent_collection?: string, recursive = false): Observable<Topic> {
    return this.xmppService.query((client, observer) => {
      client.getDiscoItems(this.jid, parent_collection, (err?: any, data?: any) => {
        if (err != null) {
          return observer.error(err);
        }

        Observable.from(data.discoItems.items)
          .map((e:any) => this.getTopicByName(e.node, recursive)).mergeAll()
          .subscribe(observer);
      });
    });
  }

  private getAllTopicsFlat(parent_collection?: string) {
    return this.getTopics(parent_collection, true)
            .expand((topic, index) => {
              if (topic instanceof Collection) {
                return Observable.from(topic.children);
              } else {
                return Observable.empty();
              }
            });
  }

  private concenateAndSortTopics(topicObservable: Observable<Topic>): Observable<Topics> {
    return topicObservable
            .reduce((topics: Topics, topic: Topic) => topics.concat([topic]), [])
            .map((topics: Topics) => topics.sort().reverse());
  }

  getServerTitle(): Promise<string> {
    return Observable.of(this.xmppService.jid.domain).toPromise();
  }

  rootTopics(): Observable<Topics> {
    return this.concenateAndSortTopics(this.getTopics());
  }

  allTopics(): Observable<Topics> {
    return this.concenateAndSortTopics(
            this.getAllTopicsFlat().filter((e:any) => e instanceof Leaf)
           );
  }

  allCollections(): Observable<Topics> {
    return this.concenateAndSortTopics(
            this.getAllTopicsFlat().filter((e:any) => e instanceof Collection)
           );
  }
}
