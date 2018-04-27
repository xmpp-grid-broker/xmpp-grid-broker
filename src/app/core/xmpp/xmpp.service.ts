import {Injectable} from '@angular/core';
import {JID} from 'xmpp-jid';
import {Client, createClient} from 'stanza.io';
import 'rxjs/add/observable/fromPromise';
import {ConfigService} from '../config.service';
import {XmppConfig} from '../models/config';
import {Namespace as NS} from 'xmpp-constants';

enum ConnectionState {
  Down = 0,
  Up = 1,
  Connecting = 2,
}

/**
 * Factory used to create new stanza.io
 * clients. This looses the coupling and
 * simplifies testing.
 */
@Injectable()
export class XmppClientFactory {
  public createClient(config: any): any {
    return createClient(config);
  }
}

/**
 * Basic XmppService that allows
 * concrete services to use xmpp
 * functionality by submitting queries.
 */
@Injectable()
export class XmppService {
  /**
   * The JID used to address the pubsub service, see XEP-0060 for details
   */
  public readonly pubSubJid: Promise<JID>;

  private readonly _client: Promise<any>;
  private readonly _config: Promise<XmppConfig>;
  private _state = ConnectionState.Down;

  constructor(private xmppClientFactory: XmppClientFactory, private configService: ConfigService) {
    this._config = this.configService.getConfig().then(config => config.xmpp);
    this._client = this._config.then(config => this._getClientInstance(config));
    this.pubSubJid = this._config.then(config => new JID(`pubsub.${config.jid_domain}`));
  }

  public getServerTitle(): Promise<string> {
    return this._config.then(config => config.jid_domain);
  }

  /**
   * Returns a promise for a client with a working connection.
   * Automatically tries to connect if no connection is established.
   */
  public getClient(): Promise<any> {
    return this._client.then(client => new Promise(resolve => {
      if (this._state === ConnectionState.Up) {
        resolve(client);
      } else {
          client.on('session:started', () => resolve(client));
          if (this._state === ConnectionState.Down) {
            this.connect();
          }
      }
    }));
  }

  /**
   * Creates a new client instance and installs the basic
   * event handlers, such as session start/end etc., on it.
   */
  private _getClientInstance(config: XmppConfig): any {
    const client = this.xmppClientFactory.createClient(config);
    client.on('session:started', () => this._state = ConnectionState.Up);
    client.on('session:end', () => this._state = ConnectionState.Down);

    client.on('auth:failed', () => {
      this._state = ConnectionState.Down;
      throw Error('XMPP authentication failed');
    });

    client.on('session:error', () => {
      this._state = ConnectionState.Down;
      throw Error('XMPP session error');
    });

    this.addMissingStanzas(client);
    return client;
  }

  /**
   * TODO: FIX in https://github.com/otalk/jxt-xmpp/blob/master/src/pubsubOwner.js
   * and open a PR to get rid of this.
   */
  private addMissingStanzas(client: any) {
    const JXT = client.stanzas;
    // TODO: REMOVE TEMPORARY WORKAROUND.
    if (!JXT) {
      return;
    }
    const PubSub = JXT.getDefinition('pubsub', NS.PUBSUB_OWNER);
    const Default = JXT.define({
      name: 'default',
      namespace: NS.PUBSUB_OWNER,
      element: 'default'
    });
    JXT.use(() => {
      JXT.extend(PubSub, Default);
    });
  }

  /**
   * Try to establish a connection to
   * the XMPP server if the connection is down.
   *
   * Note that this call is not synchronous
   * and the connection is not instantly
   * available. However, the `getClient` method
   * takes this into account and waits for the
   * connection to be available.
   */
  private connect(): void {
    this._client.then(client => {
      if (this._state === ConnectionState.Down) {
        this._state = ConnectionState.Connecting;
        client.connect();
      }
    });
  }
}
