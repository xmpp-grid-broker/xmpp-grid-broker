import {Injectable} from '@angular/core';
import {CollectionTopic, LeafTopic, Topic, Topics} from '../../core/models/topic';
import {XmppService} from '../../core/xmpp/xmpp.service';
import {JID} from 'xmpp-jid';
import {XmppDataForm} from '../../core/models/FormModels';

@Injectable()
export class TopicOverviewService {
  constructor(private xmppService: XmppService) {
  }

  public rootTopics(nextKey: string): Promise<Paged<Topic>> {
    const cmd = {
      type: 'get',
      discoItems: {
        rsm: {
          max: 10, // items at a time
          after: nextKey
        }
      }
    };

    return this.xmppService.executeIqToPubsub(cmd)
      .then(data => {
        const items = data.discoItems.items === undefined ? [] : data.discoItems.items;
        const rsm = data.discoItems.rsm;
        return Promise.all(
          items.map((item: any) => this.loadTopicDetailsNew(item.node))
        ).then((values: any) => {
          // TODO: INVESTIGATE TYPE INCOMPATIBILITY
          const topics: Topics = values;
          return new Paged(
            topics,
            parseInt(rsm.count, 10),
            parseInt(rsm.firstIndex, 10) + 10 < parseInt(rsm.count, 10),
            rsm.last,
            rsm.first);
        });
      });
  }

  public allTopics(): Promise<Topics> {
    return Promise.all([this.xmppService.getClient(), this.xmppService.pubSubJid])
      .then(([client, pubSubJid]) => this.getAllTopicsFlat(client, pubSubJid))
      .then(items => items.filter((e: any) => e instanceof LeafTopic))
      .then(topics => TopicOverviewService.sortTopics(topics));
  }

  public allCollections(): Promise<Topics> {
    return Promise.all([this.xmppService.getClient(), this.xmppService.pubSubJid])
      .then(([client, pubSubJid]) => this.getAllTopicsFlat(client, pubSubJid))
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
  private loadTopicDetails(client: any, pubSubJid: JID, name: string, loadChildren = false): Promise<Topic> {
    return new Promise((resolve, reject) => {
      client.getDiscoInfo(pubSubJid, name, (err?: any, data?: any) => {

        if (err !== null) {
          reject(`${err.error.code}: ${err.error.condition}`);
          return;
        }

        const topicTitle = data.discoInfo.node;
        const topicType = data.discoInfo.identities[0]['type'];

        if (topicType === 'leaf') {
          resolve(new LeafTopic(topicTitle));
        } else if (topicType === 'collection' && loadChildren) {
          this.loadChildTopics(client, pubSubJid, topicTitle).then((childTopics) => {
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

  /**
   * Load detailed topic information for by the given topic name.
   *
   * @param client the XMPP client to re-use
   * @param {string} name the topic identifier to load
   * @param {boolean} loadChildren true if all children of a collection shall be loaded as well (not fully recursive!)
   */
  private loadTopicDetailsNew(name: string, loadChildren = false): Promise<Topic> {
    const cmd = {
      type: 'get',
      discoInfo: {
        node: name
      }
    };
    return this.xmppService.executeIqToPubsub(cmd).then((data) => {
      const topicTitle = data.discoInfo.node;
      const topicType = data.discoInfo.identities[0]['type'];

      if (topicType === 'leaf') {
        return new LeafTopic(topicTitle);
      } else if (topicType === 'collection' && loadChildren) {
        // TODO: IMPLEMENT
        // this.loadChildTopics(client, pubSubJid, topicTitle).then((childTopics) => {
        //   return new CollectionTopic(topicTitle, childTopics);
        // });
      } else if (topicType === 'collection') {
        return new CollectionTopic(topicTitle);
      } else {
        throw new Error(`XMPP: Unsupported PubSub type "${topicType}"`);
      }
    });

  }

  private loadChildTopics(client: any, pubSubJid: JID, parent_collection?: string, recursive = false): Promise<Topics> {
    return new Promise((resolve, reject) => {
      client.getDiscoItems(pubSubJid, parent_collection, (err?: any, data?: any) => {
        if (err !== null) {
          return reject(err);
        }
        const items: Array<any> = data.discoItems.items === undefined ? [] : data.discoItems.items;

        Promise.all(
          items.map((e: any) => this.loadTopicDetails(client, pubSubJid, e.node, recursive))
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
  private getAllTopicsFlat(client: any, pubSubJid: JID): Promise<Topics> {
    return this.loadChildTopics(client, pubSubJid, undefined, true)
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

export class Paged<T> {
  constructor(public readonly items: T[],
              public readonly count: number,
              public readonly hasMore: boolean,
              public readonly nextKey: string,
              public readonly previousKey: string) {
  }
}
