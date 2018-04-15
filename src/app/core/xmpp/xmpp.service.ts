import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {JID, Client, createClient } from 'stanza.io';
import {Topic, Topics} from '../../core/models/topic';

@Injectable()
export class XmppService {
  private _client: any;
  private _config: any;
  private _state = 'disconnected';
  // TODO: Extract configuration


  constructor() {
    const config = {
      jid: 'admin@openfire',
      jid_domain: 'openfire',
      transport: 'bosh', // or websocket
      url: 'https://xgb.localhost.redbackup.org/http-bind'
    };

    this._config = {
      jid: new JID(config.jid),
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
    this._client.on('session:started', () => this._state = 'connected');
    this._client.on('session:end', () => this._state = 'disconnected');

    // TODO: Error handling
    this._client.on('auth:failed', (err) => {
      throw Error('XMPP authentication failed');
    });

    this._client.on('session:error', (err) => {
      throw Error('XMPP session error');
    });

    // Open connection
    this._client.connect();
  }

  public getTopics(collection?: string): Observable<Topics> {
    return new Observable((observer) => {

      // Postpone request, if no connection is available yet
      if (this._state === 'disconnected') {
        this._client.on('session:started', () => this.getTopics(collection).subscribe((res) => {
          observer.next(res);
          observer.complete();
        }));
        return;
      }

      this._client.getDiscoItems(`pubsub.${this._config.jid.domain}`, collection, (err?: any, data?: any) => {
        if (err != null) {
          // TODO: Error handling
          observer.error(err);
        } else {
          console.log(data); // TODO: Remove

          // TODO: Filter out all collections

          const topics = data.discoItems.items.map((e) => new Topic(e.node));
          observer.next(topics);
          observer.complete();
        }
      });
    });
  }

  public createNode(name: string) {
    this._client.createNode(`pubsub.${this._config.jid.domain}`, name, (err: Object) => {
      // TODO: Error handling
      throw Error('Could not create topic');
    });
  }
}
