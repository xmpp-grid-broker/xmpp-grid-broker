import {JID} from 'xmpp-jid';

export class Config {
  constructor(readonly xmpp: XmppConfig) {}
}

enum XmppTransport { Bosh = 'bosh', WebSocket = 'websocket' }

export abstract class XmppConfig {
  constructor(
    readonly jid: JID,
    readonly jid_domain: string,
    readonly transport: XmppTransport,
    readonly wsURL: string       = null,
    readonly boshURL: string     = null,
    readonly useStreamManagement = true,
    readonly sasl                = ['EXTERNAL'],
    readonly password: string    = null,
    readonly resource: string    = null,
    readonly timeout: number     = null
  ) {
    if (wsURL === null && boshURL === null) {
      throw new Error('Either the wsURL or boshURL property should be configured.');
    }
  }
}
