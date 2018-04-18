import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {JID, Client, createClient} from 'stanza.io';
import 'rxjs/add/observable/fromPromise';
import {Observer} from 'rxjs/Observer';

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
  public readonly config: any = {
    jid: 'admin@openfire',
    jid_domain: 'openfire',
    transport: 'bosh', // or websocket
    url: 'https://xgb.localhost.redbackup.org/http-bind'
  };

  private _client: any;
  private readonly _config: any;
  private _state = ConnectionState.Down;

  // TODO: Extract configuration (XGB-123)
  constructor(private xmppClientFactory: XmppClientFactory) {
    this._config = {
      jid: new JID(this.config.jid),
      sasl: ['EXTERNAL'],
      useStreamManagement: true,
      transport: this.config.transport,
      wsURL: '',
      boshURL: ''
    };

    switch (this.config.transport) {
      case 'websocket':
        this._config.wsURL = this.config.url;
        break;
      case 'bosh':
        this._config.boshURL = this.config.url;
        break;
    }

    this.installClient();
  }

  getServerTitle(): Promise<string> {
    return Promise.resolve(this.config.jid_domain);
  }

  /**
   * Returns a promise for a client with a working connection.
   * Automatically tries to connect if no connection is established.
   */
  public getClient(): Promise<any> {
    return new Promise((resolve) => {
      if (this._state === ConnectionState.Up) {
        resolve(this._client);
      } else {
        this._client.on('session:started', () => {
          this.getClient().then(resolve);
        });
        if (this._state === ConnectionState.Down) {
          this.connect();
        }
      }
    });
  }

  /**
   * Creates a new client instance and installs the basic
   * event handlers, such as session start/end etc., on it.
   */
  private installClient() {
    this._client = this.xmppClientFactory.createClient(this._config);
    this._client.on('session:started', () => this._state = ConnectionState.Up);
    this._client.on('session:end', () => this._state = ConnectionState.Down);

    this._client.on('auth:failed', (err) => {
      this._state = ConnectionState.Down;
      throw Error('XMPP authentication failed');
    });

    this._client.on('session:error', (err) => {
      this._state = ConnectionState.Down;
      throw Error('XMPP session error');
    });
  }

  /**
   * Try to establish a connection to
   * the XMPP server if the connection is down.
   *
   * Note that this call is not synchronous
   * and the connection is not instantly
   * available. However, the `query` method
   * takes this into account and waits for the
   * connection to be available.
   */
  private connect(): void {
    if (this._state === ConnectionState.Down) {
      this._state = ConnectionState.Connecting;
      this._client.connect();
    }
  }
}
