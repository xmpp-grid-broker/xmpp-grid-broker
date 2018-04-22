import {Injectable} from '@angular/core';
import {XmppService} from '../core/xmpp/xmpp.service';
import {JID} from 'stanza.io';

@Injectable()
export class TopicCreationService {
  constructor(private xmppService: XmppService) {
  }

  createTopic(title: string): Promise<string> {
    return this.xmppService.getClient()
      .then((client) => this._createService(title, client));
  }

  private _createService(title: string, client: any): Promise<string> {
    return new Promise((resolve, reject) => {
      client.createNode(this.xmppService.pubSubJid, title, {}, (err) => {
        if (err) {
          reject(err);
        }
        resolve(title);
      });
    });
  }


}
