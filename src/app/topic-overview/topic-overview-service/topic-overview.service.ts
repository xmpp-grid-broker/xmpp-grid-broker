import {Injectable} from '@angular/core';
import {CollectionTopic, LeafTopic, Topic} from '../../core/models/topic';
import {IqType, XmppService} from '../../core/xmpp/xmpp.service';

@Injectable()
export class TopicOverviewService {
  // The internally used page size, meaning how many nodes to load at a time using result set management
  private readonly PAGE_SIZE = 10;

  constructor(private xmppService: XmppService) {
  }


  public rootTopics(): AsyncIterableIterator<Topic> {
    return this.createTopicsIterator(false);
  }

  public allTopics(): AsyncIterableIterator<Topic> {
    return this.createFilterTopicsIterator((value) => value instanceof LeafTopic);
  }

  public allCollections(): AsyncIterableIterator<Topic> {
    return this.createFilterTopicsIterator((value) => value instanceof CollectionTopic);
  }

  /**
   * Returns an async iterator that yields all root topics/collections.
   * If recursive is set to true, all child topics/collections of the
   * root topics/collections are yielded as well.
   */
  private async* createTopicsIterator(recursive: boolean): AsyncIterableIterator<Topic> {

const topicsForWhichTheChildsShallBeLoaded: Array<string | undefined> = [undefined]; // undefinded = root
    const visitedTopics = []; // To prevent duplicates...
    while (topicsForWhichTheChildsShallBeLoaded.length > 0) {
      const topicName = topicsForWhichTheChildsShallBeLoaded.pop();

      // Iterate over all it's children
      const iterator = this.createTopicChildrenIterator(topicName);
      let next = await iterator.next();
      while (!next.done) {
        const topic = next.value;
        // top prevent duplicates...
        if (visitedTopics.indexOf(topic.title) >= 0) {
          continue;
        }
        yield topic;
        visitedTopics.push(topic.title);
        if (recursive && topic instanceof CollectionTopic) {
          topicsForWhichTheChildsShallBeLoaded.push(topic.title);
        }
        next = await iterator.next();
      }
    }
  }

  /**
   * Returns an async iterator that yields all direct child topics/collections
   * of the given topic identifier.
   */
  private async* createTopicChildrenIterator(topicIdentifier: string): AsyncIterableIterator<Topic> {
    let loadAfter: number | undefined;
    let hasMore = true;
    do {
      const cmd = {
        type: IqType.Get,
        discoItems: {
          node: topicIdentifier,
          rsm: {
            max: this.PAGE_SIZE,
            after: loadAfter
          }
        }
      };

      const response = await this.xmppService.executeIqToPubsub(cmd);
      const items = response.discoItems.items === undefined ? [] : response.discoItems.items;
      const rsm = response.discoItems.rsm;
      loadAfter = rsm.last;
      hasMore = parseInt(rsm.firstIndex, 10) + this.PAGE_SIZE < parseInt(rsm.count, 10);

      for (let idx = 0; idx < items.length; idx++) {
        const item = items[idx];
        const topic = await this.loadTopicByIdentifier(item.node);
        yield topic;
      }
    } while (hasMore);
  }

  /**
   * Load detailed Topic information (ie. Leaf or Collection) by its identifier.
   */
  private async loadTopicByIdentifier(name: string): Promise<Topic> {
    const cmd = {
      type: IqType.Get,
      discoInfo: {
        node: name
      }
    };
    const response = await this.xmppService.executeIqToPubsub(cmd);
    const topicTitle = response.discoInfo.node;
    const topicType = response.discoInfo.identities[0]['type'];

    if (topicType === 'leaf') {
      return new LeafTopic(topicTitle);
    } else if (topicType === 'collection') {
      return new CollectionTopic(topicTitle);
    } else {
      throw new Error(`XMPP: Unsupported PubSub type "${topicType}"`);
    }

  }

  /**
   * Same as createTopicsIterator(true), but only yield the elements for which the
   * given predicate returns true.
   */
  private async* createFilterTopicsIterator(predicate: (value) => boolean): AsyncIterableIterator<Topic> {
    const iterator = this.createTopicsIterator(true);

    let next = await iterator.next();
    while (!next.done) {
      if (predicate(next.value)) {
        yield next.value;
      }
      next = await iterator.next();
    }
  }
}
