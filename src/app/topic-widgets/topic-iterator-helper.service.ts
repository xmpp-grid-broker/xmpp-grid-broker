import {IqType, XmppService} from '../core/xmpp/xmpp.service';
import {CollectionTopic, Topic} from '../core/models/topic';
import {Injectable} from '@angular/core';

@Injectable()
export class TopicIteratorHelperService {
  // The internally used page size, meaning how many nodes to load at a time using result set management
  private readonly PAGE_SIZE = 10;

  constructor(private xmppService: XmppService) {
  }

  /**
   * Returns an async iterator that yields all child topics/collections of the given topic.
   * Setting topicIdentifier to undefined returns all root topics/collections.
   * If recursive is set to true, all child topics/collections of the
   * root topics/collections are yielded as well.
   */
  public async* createTopicsIterator(topicIdentifier: string, recursive: boolean): AsyncIterableIterator<Topic> {

    const topicsForWhichTheChildsShallBeLoaded: Array<string | undefined> = [topicIdentifier];
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
   * Same as createTopicsIterator(true), but only yield the elements for which the
   * given predicate returns true.
   */
  public async* createFilterTopicsIterator(topicIdentifier: string, predicate: (value) => boolean): AsyncIterableIterator<Topic> {
    const iterator = this.createTopicsIterator(topicIdentifier, true);

    let next = await iterator.next();
    while (!next.done) {
      if (predicate(next.value)) {
        yield next.value;
      }
      next = await iterator.next();
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
    return Topic.fromDiscoInfo(response.discoInfo);

  }

}
