import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {JID, Client, createClient} from 'stanza.io';

enum ConnectionState {
  Down = 0,
  Up = 1,
  Connecting = 2,
}

@Injectable()
export class XmppService {
  private _client: any;
  private readonly _config: any;
  private _state = ConnectionState.Down;

  readonly jid: any;

  // TODO: Extract configuration (XGB-122)
  constructor() {
    const config = {
      jid: 'admin@openfire',
      jid_domain: 'openfire',
      transport: 'bosh', // or websocket
      url: 'https://xgb.localhost.redbackup.org/http-bind'
    };

    this.jid = new JID(config.jid);
    this._config = {
      jid: this.jid,
      sasl: [ 'EXTERNAL' ],
      useStreamManagement: true,
      transport: config.transport,
      wsURL: '',
      boshURL: ''
    };

    switch (config.transport) {
      case 'websocket':
        this._config.wsURL = config.url;
        break;
      case 'bosh':
        this._config.boshURL = config.url;
        break;
      default:
        throw new Error(`Unsupported Transport "${config.transport}"`);
    }

    this._client = createClient(this._config);
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

  public query<T>(cb: (client: any, observer: Observer<T>) => any): Observable<T> {
    return new Observable((observer) => {
      if (this._state === ConnectionState.Up) {
        cb(this._client, observer);
      } else {
        this._client.on('session:started', () => this.query(cb).subscribe(observer));
        this.connect();
      }
    });
  }

  private connect() {
    if (this._state === ConnectionState.Down) {
      this._state = ConnectionState.Connecting;
      this._client.connect();
    }
  }
}
