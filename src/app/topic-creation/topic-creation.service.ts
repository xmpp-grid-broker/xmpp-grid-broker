import {Injectable} from '@angular/core';
import {XmppService} from '../core/xmpp/xmpp.service';
import {JID} from 'stanza.io';

@Injectable()
export class TopicCreationService {
  constructor(private xmppService: XmppService) {
  }

  createTopic(topicIdentifier: string): Promise<string> {
    return this.xmppService.getClient()
      .then((client) => this._createService(topicIdentifier, client));
  }

  private _createService(topicIdentifier: string, client: any): Promise<string> {
    return new Promise((resolve, reject) => {
      client.createNode(this.xmppService.pubSubJid, topicIdentifier, {}, (err) => {
        if (err) {
          reject(err);
        }
        resolve(topicIdentifier);
      });
    });
  }


}
