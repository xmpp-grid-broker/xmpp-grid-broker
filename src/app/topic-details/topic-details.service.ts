import {Injectable} from '@angular/core';
import {XmppDataForm} from '../core/models/FormModels';
import {XmppService} from '../core/xmpp/xmpp.service';
import {JID} from 'xmpp-jid';

export enum LoadFormErrorCodes {
  ItemNotFound = 'item-not-found',
  Unsupported = 'unsupported',
  Forbidden = 'forbidden',
  NotAllowed = 'not-allowed'
}

@Injectable()
export class TopicDetailsService {

  constructor(private xmppService: XmppService) {
  }

  public loadForm(topicIdentifier: string): Promise<XmppDataForm> {
    return Promise.all([this.xmppService.getClient(), this.xmppService.pubSubJid])
      .then(([client, pubSubJid]) => this._loadFormFromClient(client, pubSubJid, topicIdentifier));
  }

  public updateTopic(topicIdentifier: string, xmppDataForm: XmppDataForm): Promise<XmppDataForm> {
    return Promise.all([this.xmppService.getClient(), this.xmppService.pubSubJid])
      .then(([client, pubSubJid]) => this._submitForm(client, pubSubJid, topicIdentifier, xmppDataForm))
      .then(() => this.loadForm(topicIdentifier));
  }

  private _loadFormFromClient(client: any, pubSubJid: JID, topicIdentifier: string): Promise<XmppDataForm> {
    const cmd = {
      type: 'get',
      to: pubSubJid,
      pubsubOwner: {
        config: {
          node: topicIdentifier,
        }
      }
    };

    return new Promise<XmppDataForm>((resolve, reject) => {
      client.sendIq(cmd, (err, result) => {
          if (err) {
            reject(err.error);
          } else {
            resolve(XmppDataForm.fromJSON(result.pubsubOwner.config.form));
          }
        }
      )
      ;
    });
  }

  private _submitForm(client: any, pubSubJid: JID, topicIdentifier: string, xmppDataForm: XmppDataForm): Promise<void> {
    const form = xmppDataForm.toJSON();
    form['type'] = 'submit';

    const cmd = {
      type: 'set',
      to: pubSubJid,
      pubsubOwner: {
        config: {
          node: topicIdentifier,
          form: form
        }
      }
    };

    return new Promise<void>((resolve, reject) => {
      client.sendIq(cmd, (err) => {
          if (err) {
            reject(err.error);
          } else {
            resolve();
          }
        }
      );
    });
  }
}
