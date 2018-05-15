import {Injectable} from '@angular/core';
import {IqType, XmppService} from '../core/xmpp/xmpp.service';
import {Subscription} from '../core/models/Subscription';

@Injectable()
export class TopicSubscriptionService {

  constructor(private xmppService: XmppService) {
  }

  /*
    * Loads all subscriptions of the given topic.
  */
  public loadSubscriptions(topicIdentifier: string): Promise<Subscription[]> {
    const cmd = {
      type: IqType.Get,
      pubsubOwner: {
        subscriptions: {
          node: topicIdentifier
        }
      }
    };
    return this.xmppService.executeIqToPubsub(cmd)
      .then((response) =>
        response.pubsubOwner.subscriptions.list
          .map((entry) => new Subscription(entry.jid.full, entry.subid, entry.expiry, entry.subscription))
      );
  }
}
