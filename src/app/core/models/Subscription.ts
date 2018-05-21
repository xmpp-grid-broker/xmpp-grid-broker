/**
 * Represents the state of a subscription.
 */
export enum SubscriptionState {
  None = 'none',
  Pending = 'pending',
  Subscribed = 'subscribed',
  Unconfigured = 'unconfigured',
}

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
