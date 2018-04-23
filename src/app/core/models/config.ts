export class Config {
  constructor(readonly xmpp: XmppConfig) {}
}

export abstract class XmppConfig {
  // TODO: provide default values
  constructor() {}
}
