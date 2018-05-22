export abstract class Topic {
  constructor(public title: string) {
  }

  static fromDiscoInfo(discoInfo: any): Topic {
    const topicTitle = discoInfo.node;
    const topicType = discoInfo.identities[0]['type'];

    if (topicType === 'leaf') {
      return new LeafTopic(topicTitle);
    } else if (topicType === 'collection') {
      return new CollectionTopic(topicTitle);
    } else {
      throw new Error(`XMPP: Unsupported PubSub type "${topicType}"`);
    }
  }

  /**
   * utility method to simplify template code.
   */
  public isCollection(): boolean {
    return this instanceof CollectionTopic;
  }
  /**
   * utility method to simplify template code.
   */
  public isLeaf(): boolean {
    return this instanceof LeafTopic;
  }
}

export type Topics = Array<Topic>;

export class LeafTopic extends Topic {
}

export class CollectionTopic extends Topic {
}
