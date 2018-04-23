import {Injectable} from '@angular/core';
import {CollectionTopic, LeafTopic, Topic, Topics} from '../../core/models/topic';
import {XmppService} from '../../core/xmpp/xmpp.service';
import {JID} from 'xmpp-jid';

@Injectable()
export class TopicOverviewService {

  constructor(private xmppService: XmppService) {
  }

  rootTopics(): Promise<Topics> {
    return this.xmppService.getClient()
      .then(client => this.loadChildTopics(client))
      .then(topics => TopicOverviewService.sortTopics(topics));
  }

  allTopics(): Promise<Topics> {
    return this.xmppService.getClient()
      .then(client => this.getAllTopicsFlat(client))
      .then(items => items.filter((e: any) => e instanceof LeafTopic))
      .then(topics => TopicOverviewService.sortTopics(topics));
  }

  allCollections(): Promise<Topics> {
    return this.xmppService.getClient()
      .then(client => this.getAllTopicsFlat(client))
      .then(items => items.filter((e: any) => e instanceof CollectionTopic))
      .then(topics => TopicOverviewService.sortTopics(topics));
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
      client.getDiscoInfo(this.xmppService.pubSubJid, name, (err?: any, data?: any) => {

        if (err !== null) {
          reject(`${err.error.code}: ${err.error.condition}`);
          return;
        }

        const topicTitle = data.discoInfo.node;
        const topicType = data.discoInfo.identities[0]['type'];

        if (topicType === 'leaf') {
          resolve(new LeafTopic(topicTitle));
        } else if (topicType === 'collection' && loadChildren) {
          this.loadChildTopics(client, topicTitle).then((childTopics) => {
            resolve(new CollectionTopic(topicTitle, childTopics));
          });
        } else if (topicType === 'collection') {
          resolve(new CollectionTopic(topicTitle));
        } else {
          reject(`XMPP: Unsupported PubSub type "${topicType}"`);
        }
      });
    });

  }

  private loadChildTopics(client, parent_collection?: string, recursive = false): Promise<Topics> {
    return new Promise((resolve, reject) => {
      client.getDiscoItems(this.xmppService.pubSubJid, parent_collection, (err?: any, data?: any) => {
        if (err !== null) {
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
        if (it instanceof CollectionTopic) {
          this.flatten(it.children, result);
        }
      });
    }
  }

  private static sortTopics(topics: Topics): Promise<Topics> {
    return new Promise((resolve) => {
      resolve(topics.sort((a, b) => a.title.localeCompare(b.title)));
    });
  }
}
