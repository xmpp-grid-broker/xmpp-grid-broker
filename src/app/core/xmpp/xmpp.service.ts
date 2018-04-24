import {Injectable} from '@angular/core';
import {JID} from 'xmpp-jid';
import {Client, createClient} from 'stanza.io';
import 'rxjs/add/observable/fromPromise';
import {ConfigService} from '../config.service';
import {XmppConfig} from '../models/config';

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
  public readonly pubSubJid;

  private readonly _client: Promise<any>;
  private readonly _config: Promise<XmppConfig>;
  private _state = ConnectionState.Down;

  constructor(private xmppClientFactory: XmppClientFactory, private configService: ConfigService) {
    this._config = this.configService.getConfig().then(config => config.xmpp);
    this._client = this._config.then(config => this._getClientInstance(config));
    this.pubSubJid = new JID(`pubsub.${this.config.jid_domain}`); // TODO: Make promise
  }

  public getServerTitle(): Promise<string> {
    return this._config.then(config => config.jid.domain);
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

    return client;
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
