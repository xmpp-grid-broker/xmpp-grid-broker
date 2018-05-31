import {SubscriptionState} from './subscription-state';

/**
 * A class that represents a subscription
 * of a JID (to a node).
 */
export class Subscription {
  constructor(public jid: string,
              public subid?: string,
              public expiry?: string,
              public state?: SubscriptionState) {
  }
}
