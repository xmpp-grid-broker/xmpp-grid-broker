import {JID} from 'xmpp-jid';

export enum XmppTransport {
  Bosh = 'bosh',
  WebSocket = 'websocket'
}

export class XmppConfig {
  constructor(
    readonly jid: JID,
    readonly jid_domain: string,
    readonly transport: XmppTransport,
    readonly wsURL?: string,
    readonly boshURL?: string,
    readonly useStreamManagement = true,
    readonly sasl = ['EXTERNAL'],
    readonly password?: string,
    readonly resource?: string,
    readonly timeout?: number
  ) {
    if (wsURL === undefined && boshURL === undefined) {
      throw new Error('XMPP configuration wsURL or boshURL property must be configured.');
    }
  }

  /**
   * Build a XmppConfig from untyped json Object.
   * @param json
   * @returns {XmppConfig}
   */
  static fromJson(json: any): XmppConfig {
    const requiredFieldNames = ['jid', 'jid_domain', 'transport'];
    for (const fieldName of requiredFieldNames) {
      if (!json[fieldName]) {
        throw Error(`XMPP configuration field "${fieldName}" must be configured`);
      }
    }

    if (json.transport && json.transport !== XmppTransport.Bosh && json.transport !== XmppTransport.WebSocket) {
      throw new Error('XMPP configuration "transport" must either be bosh or websocket.');
    }

    return new XmppConfig(
      new JID(json.jid),
      json.jid_domain,
      json.transport,
      json.wsURL,
      json.boshURL,
      json.useStreamManagement,
      json.sasl,
      json.password,
      json.timeout
    );
  }
}

export class Config {
  constructor(readonly xmpp: XmppConfig) {}

  /**
   * Build a Config from untyped json Object.
   * @param json
   * @returns {Config}
   */
  static fromJson(json: any): Config {
    const requiredFieldNames = ['xmpp'];
    for (const fieldName of requiredFieldNames) {
      if (!json[fieldName]) {
        throw Error(`Configuration field "${fieldName}" is undefined!`);
      }
    }

    return new Config(XmppConfig.fromJson(json.xmpp));
  }
}
