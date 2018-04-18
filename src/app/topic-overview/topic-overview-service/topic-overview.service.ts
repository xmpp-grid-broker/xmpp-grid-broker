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
import {Subject} from 'rxjs/Subject';

@Injectable()
export class TopicOverviewService {
  /**
   * The JID used to address the pubsub service, see XEP-0060 for details
   */
  readonly pubSubJid: any;

  constructor(private xmppService: XmppService) {
    this.pubSubJid = new JID(`pubsub.${xmppService.config.jid_domain}`);
  }

  rootTopics(): Observable<Topics> {
    return this.concatenateAndSortTopics(this.loadChildTopics());
  }

  allTopics(): Observable<Topics> {
    return this.concatenateAndSortTopics(
      this.getAllTopicsFlat().filter((e: any) => e instanceof Leaf)
    );
  }

  allCollections(): Observable<Topics> {
    return this.concatenateAndSortTopics(
      this.getAllTopicsFlat().filter((e: any) => e instanceof Collection)
    );
  }

  /**
   * Load detailed topic information for by the given topic name.
   *
   * @param client the XMPP client to re-use
   * @param {string} name the topic identifier to load
   * @param {boolean} loadChildren true if all children of a collection shall be loaded as well (not fully recursive!)
   * @returns {Observable<Topic>}
   */
  private getTopicDetails(client: any, name: string, loadChildren = false): Observable<Topic> {
    const result = new Subject<Topic>();
    client.getDiscoInfo(this.pubSubJid, name, (err?: any, data?: any) => {

      if (err != null) {
        result.error(`${err.error.code}: ${err.error.condition}`);
        return;
      }

      const topicTitle = data.discoInfo.node;
      const topicType = data.discoInfo.identities[0]['type'];

      if (topicType === 'leaf') {
        result.next(new Leaf(topicTitle));
        result.complete();
      } else if (topicType === 'collection' && loadChildren) {
        this.loadChildTopics(topicTitle)
          .reduce((topics: Topics, topic: Topic) => topics.concat([topic]), [])
          .subscribe((childTopics) => {
              result.next(new Collection(topicTitle, childTopics));
              result.complete();
            }
          );
      } else if (topicType === 'collection') {
        result.next(new Collection(topicTitle));
        result.complete();
      } else {
        result.error(`XMPP: Unsupported PubSub type "${topicType}"`);
      }
    });
    return result;
  }


  private loadChildTopics(parent_collection?: string, recursive = false): Observable<Topic> {
    const result = new Subject<Topic>();

    this.xmppService.getClient().then((client) => {

      client.getDiscoItems(this.pubSubJid, parent_collection, (err?: any, data?: any) => {
        if (err != null) {
          return result.error(err);
        }
        const items: Array<any> = data.discoItems.items === undefined ? [] : data.discoItems.items;
        console.log(items)
        Observable.from(items)
          .map((e: any) => this.getTopicDetails(client, e.node, recursive)).mergeAll()
          .subscribe(result);
      });
    });
    return result;
  }


  /**
   * Returns the same as `getTopics` but as a
   * flat list instead of a hierarchical structure.
   */
  private getAllTopicsFlat(todoRemoveME?: string): Observable<Topic> {
    return this.loadChildTopics(todoRemoveME, true)
      .expand((topic, index) => {
        if (topic instanceof Collection) {
          return Observable.from(topic.children);
        } else {
          return Observable.empty();
        }
      });
  }


  private concatenateAndSortTopics(topicObservable: Observable<Topic>): Observable<Topics> {
    return topicObservable
      .reduce((topics: Topics, topic: Topic) => topics.concat([topic]), [])
      .map((topics: Topics) => topics.sort((a: Topic, b: Topic) => a.title.localeCompare(b.title)));
  }

  private createTopic(name: string): Promise<any> {
    return this.xmppService.getClient().then((client) => {
      client.createNode(this.pubSubJid, name, (err: Object) => {
        if (err) {
          throw Error('Could not create topic');
        } else {
          console.log('Here we go...');
        }

      });
    });
  }


}
