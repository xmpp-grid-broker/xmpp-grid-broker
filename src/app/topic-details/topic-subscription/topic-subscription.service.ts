import {Injectable} from '@angular/core';
import {IqType, XmppService} from '../../core/xmpp/xmpp.service';
import {Subscription} from '../../core/models/Subscription';
import {JxtErrorToXmppError, XmppErrorCondition} from '../../core/errors';


@Injectable()
export class TopicSubscriptionService {

  constructor(private xmppService: XmppService) {
  }

  /**
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
      .then((response) => {
          const subscriptions = response.pubsubOwner.subscriptions.list || [];
          return subscriptions.map((entry) => new Subscription(entry.jid.full, entry.subid, entry.expiry, entry.type));
        }
      ).catch((err) => {
        throw JxtErrorToXmppError(err, {
            [XmppErrorCondition.FeatureNotImplemented]: `Node or service does not support subscription management`,
            [XmppErrorCondition.Forbidden]: `You don't have sufficient privileges to manage subscriptions`,
            [XmppErrorCondition.ItemNotFound]: `Topic ${topicIdentifier} does not exist`
          }
        );
      });
  }

  /**
   * Subscribes the given jid to the provided topic.
   * Setting a configuration during creation is not supported.
   * If the promise resolves, the subscription was (according to the
   * server) successful.
   */
  public subscribe(topicIdentifier: string, jid: string): Promise<void> {
    const cmd = {
      type: IqType.Set,
      pubsub: {
        subscribe: {
          node: topicIdentifier,
          jid: jid
        }
      }
    };
    return this.xmppService.executeIqToPubsub(cmd)
      .then((response) => {
      }).catch((err) => {
        throw JxtErrorToXmppError(err, {
            [XmppErrorCondition.BadRequest]: `You are not allowed to subscribe ${jid} to ${topicIdentifier}`,
            [XmppErrorCondition.NotAuthorized]: `Either you or ${jid} are not authorized to subscribe on ${jid}. `
            + 'Checkout the access model and configuration.',
            [XmppErrorCondition.PaymentRequired]: `The service requires payment for subscriptions to ${topicIdentifier}`,
            [XmppErrorCondition.Forbidden]: `${jid} is blocked from subscribing`,
            [XmppErrorCondition.PolicyViolation]: 'Too many subscriptions',
            [XmppErrorCondition.FeatureNotImplemented]: `Topic ${topicIdentifier} does not support subscriptions.`,
            [XmppErrorCondition.Gone]: `Node ${topicIdentifier} has been moved`,
            [XmppErrorCondition.ItemNotFound]: `Topic ${topicIdentifier} does not exist`
          }
        );
      });
  }
}

