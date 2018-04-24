import {Injectable} from '@angular/core';
import {XmppDataForm} from '../core/models/FormModels';
import {XmppService} from '../core/xmpp/xmpp.service';

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
    return this.xmppService.getClient()
      .then((client) => this._loadFormFromClient(client, topicIdentifier));
  }

  public updateTopic(topicIdentifier: string, xmppDataForm: XmppDataForm): Promise<XmppDataForm> {
    return this.xmppService.getClient()
      .then((client) => this._submitForm(client, topicIdentifier, xmppDataForm))
      .then(() => this.loadForm(topicIdentifier));
  }

  private _loadFormFromClient(client: any, topicIdentifier: string): Promise<XmppDataForm> {
    const cmd = {
      type: 'get',
      to: this.xmppService.pubSubJid,
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

  private _submitForm(client: any, topicIdentifier: string, xmppDataForm: XmppDataForm): Promise<void> {
    const form = xmppDataForm.toJSON();
    form['type'] = 'submit';

    const cmd = {
      type: 'set',
      to: this.xmppService.pubSubJid,
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
