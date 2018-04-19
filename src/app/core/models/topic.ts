export abstract class Topic {
  constructor(public title: string) {
  }
}

export type Topics = Array<Topic>;

export class LeafTopic extends Topic {
}

export class CollectionTopic extends Topic {
  constructor(public title: string, public children?: Topics) {
    super(title);
  }
}
