import {Injectable} from '@angular/core';
import {XmppService} from '../core/xmpp/xmpp.service';
import {JID} from 'xmpp-jid';
import {JXT} from 'stanza.io';
import {XmppDataForm} from '../core/models/FormModels';

export enum TopicCreationErrors {
  FeatureNotImplemented = 'feature-not-implemented',
  RegistrationRequired = 'registration-required',
  Forbidden = 'forbidden',
  Conflict = 'conflict',
  NodeIdRequired = 'nodeid-required'
}

@Injectable()
export class TopicCreationService {
  constructor(private xmppService: XmppService) {
  }

  public createTopic(topicIdentifier: string, config: XmppDataForm): Promise<string> {
    return Promise.all([this.xmppService.getClient(), this.xmppService.pubSubJid])
      .then(([client, pubSubJid]) => this._createService(topicIdentifier, config, client, pubSubJid));
  }

  /**
   * Support for this feature is OPTIONAL
   * (See "Request Default Node Configuration Options" in XEP-0060)
   */
  public loadDefaultConfig(): Promise<XmppDataForm> {
    return Promise.all([this.xmppService.getClient(), this.xmppService.pubSubJid])
      .then(([client, pubSubJid]) => this._loadDefaultConfig(client, pubSubJid));
  }

  private _createService(topicIdentifier: any, config: XmppDataForm, client: any, pubSubJid: JID): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!topicIdentifier) {
        topicIdentifier = true;
      }
      const jsonConfig = config ? config.toJSON() : {};

      client.createNode(pubSubJid, topicIdentifier, jsonConfig, (err, result) => {
        if (err) {
          reject(err.error);
        } else if (result.pubsub) {
          // If the service returns a nodeID (generated by the server)
          resolve(result.pubsub.create);
        } else {
          resolve(topicIdentifier);
        }
      });
    });
  }


  private _loadDefaultConfig(client: any, pubSubJid: JID): Promise<XmppDataForm> {
    return new Promise((resolve, reject) => {
      const cmd = {
        type: 'get',
        to: pubSubJid,
        pubsubOwner: {
          'default': true,
        }
      };
      client.sendIq(cmd, (err, result) => {
        if (err) {
          console.log(err);
          reject(err.error);
        } else {
          console.log(result);
          resolve(XmppDataForm.fromJSON(result.pubsubOwner.default.form));
        }
      });
    });
  }
}
