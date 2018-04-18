import {Injectable} from '@angular/core';
import {Collection, Leaf, Topic, Topics} from '../../core/models/topic';
import {XmppService} from '../../core/xmpp/xmpp.service';
import {JID} from 'stanza.io';

@Injectable()
export class TopicOverviewService {
  /**
   * The JID used to address the pubsub service, see XEP-0060 for details
   */
  readonly pubSubJid: any;

  constructor(private xmppService: XmppService) {
    this.pubSubJid = new JID(`pubsub.${xmppService.config.jid_domain}`);
  }

  rootTopics(): Promise<Topics> {
    return this.xmppService.getClient().then((client) => {
      return TopicOverviewService.sorted(this.loadChildTopics(client));
    });
  }

  allTopics(): Promise<Topics> {

    return this.xmppService.getClient().then((client) => {
      return TopicOverviewService.sorted(
        this.getAllTopicsFlat(client).then((items) =>
          items.filter((e: any) => e instanceof Leaf)
        ));
    });
  }

  allCollections(): Promise<Topics> {
    return this.xmppService.getClient().then((client) => {
      return TopicOverviewService.sorted(
        this.getAllTopicsFlat(client).then((items) =>
          items.filter((e: any) => e instanceof Collection)
        ));
    });
  }

  /**
   * Load detailed topic information for by the given topic name.
   *
   * @param client the XMPP client to re-use
   * @param {string} name the topic identifier to load
   * @param {boolean} loadChildren true if all children of a collection shall be loaded as well (not fully recursive!)
   */
  private loadTopicDetails(client: any, name: string, loadChildren = false): Promise<Topic> {

    return new Promise((resolve, reject) => {
      client.getDiscoInfo(this.pubSubJid, name, (err?: any, data?: any) => {

        if (err != null) {
          reject(`${err.error.code}: ${err.error.condition}`);
          return;
        }

        const topicTitle = data.discoInfo.node;
        const topicType = data.discoInfo.identities[0]['type'];

        if (topicType === 'leaf') {
          resolve(new Leaf(topicTitle));
        } else if (topicType === 'collection' && loadChildren) {
          this.loadChildTopics(client, topicTitle).then((childTopics) => {
            resolve(new Collection(topicTitle, childTopics));
          });
        } else if (topicType === 'collection') {
          resolve(new Collection(topicTitle));
        } else {
          reject(`XMPP: Unsupported PubSub type "${topicType}"`);
        }
      });
    });

  }

  private loadChildTopics(client, parent_collection?: string, recursive = false): Promise<Topics> {
    return new Promise((resolve, reject) => {
      client.getDiscoItems(this.pubSubJid, parent_collection, (err?: any, data?: any) => {
        if (err != null) {
          return reject(err);
        }
        const items: Array<any> = data.discoItems.items === undefined ? [] : data.discoItems.items;

        Promise.all(
          items.map((e: any) => this.loadTopicDetails(client, e.node, recursive))
        ).then((values) => {
          resolve(values);
        });
      });
    });
  }

  /**
   * Returns the same as `getTopics` but as a
   * flat list instead of a hierarchical structure.
   */
  private getAllTopicsFlat(client: any): Promise<Topics> {
    return this.loadChildTopics(client, undefined, true)
      .then((childTopics) => {
        const result: Topics = [];
        this.flatten(childTopics, result);
        return result;
      });
  }


  private flatten(topics: Topics, result: Topics) {
    if (topics !== undefined) {

      result.push(...topics);
      topics.forEach((it) => {
        if (it instanceof Collection) {
          this.flatten(it.children, result);
        }
      });
    }
  }


  private static sorted(topicPromise: Promise<Topics>): Promise<Topics> {
    return topicPromise.then((topics) => {
      return topics.sort((a, b) => a.title.localeCompare(b.title));
    });
  }
}
