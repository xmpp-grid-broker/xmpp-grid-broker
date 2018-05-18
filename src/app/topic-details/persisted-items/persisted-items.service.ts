import {Injectable} from '@angular/core';
import {IqType, XmppService} from '../../core/xmpp/xmpp.service';

export class PersistedItem {
  /**
   * The XML payload of the persisted item in the form of a plain xml string.
   */
  public rawXML: string;

  constructor(public readonly id: string) {
  }
}

export enum LoadPersistedItemsErrors {
  FeatureNotImplemented = 'feature-not-implemented',
  NotAuthorized = 'not-authorized',
  PaymentRequired = 'payment-required',
  Forbidden = 'forbidden',
  ItemNotFound = 'item-not-found',
}

export enum PublishItemErrors {
  Forbidden = 'forbidden',
  FeatureNotImplemented = 'feature-not-implemented',
  ItemNotFound = 'item-not-found',
  NotAcceptable = 'not-acceptable',
  BadRequest = 'bad-request'
}

@Injectable()
export class PersistedItemsService {
  /**
   * The number of items to fetch at a time from
   * the xmpp server (result management page size).
   */
  private PAGE_SIZE = 10;

  constructor(private xmppService: XmppService) {
  }

  /**
   * Loads and sets the XML payload of the given persisted item.
   * Will set the value in-place on the provided item and returns
   * the same instance as well with the raw-xml field populated.
   */
  public loadPersistedItemContent(topicIdentifier: string, item: PersistedItem): Promise<PersistedItem> {
    const detailedCmd = {
      type: IqType.Get,
      pubsub: {
        retrieve: {
          node: topicIdentifier,
          item: {
            id: item.id
          }
        },
      }
    };

    return this.xmppService.executeIqToPubsub(detailedCmd)
      .then((result) => {
        const detailedItem = result.pubsub.retrieve.item;
        item.rawXML = detailedItem.rawXML;
        return item;
      });
  }

  /**
   * Returns an Async iterator to iterate through all persisted items
   * of the topic with the given topic identifier.
   *
   * Note that the yielded persisted elements do not contain their payload.
   * Use the corresponding service method on {@link PersistedItemsService#loadPersistedItemContent} instead.
   */
  public async* persistedItems(topicIdentifier: string): AsyncIterableIterator<PersistedItem> {
    let loadAfter;
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
      const items = response.discoItems.items;
      if (!items) {
        return;
      }

      const rsm = response.discoItems.rsm;
      loadAfter = rsm.last;
      hasMore = parseInt(rsm.firstIndex, 10) + this.PAGE_SIZE < parseInt(rsm.count, 10);

      for (const item of items) {
        yield new PersistedItem(item.name);
      }
    } while (hasMore);

  }

  /**
   * Deletes the given persisted item from the given node.
   */
  public deletePersistedItem(topicIdentifier: string, item: PersistedItem): Promise<void> {
    const detailedCmd = {
      type: IqType.Get,
      pubsub: {
        retract: {
          node: topicIdentifier,
          id: item.id
        },
      }
    };

    return this.xmppService.executeIqToPubsub(detailedCmd);
  }

  /**
   * Purge all persisted items on the given topic.
   */
  public purgePersistedItem(topicIdentifier: string): Promise<void> {
    const detailedCmd = {
      type: IqType.Get,
      pubsubOwner: {
        purge: topicIdentifier
      }
    };

    return this.xmppService.executeIqToPubsub(detailedCmd);
  }

  public publishItem(topicIdentifier: string, rawXML: string): Promise<void> {
    const cmd = {
      type: IqType.Get,
      pubsub: {
        publish: {
          node: topicIdentifier,
          item: {
            rawXML: rawXML
          },
        }
      }
    };
    return this.xmppService.executeIqToPubsub(cmd).then(() => {
    });
  }
}
