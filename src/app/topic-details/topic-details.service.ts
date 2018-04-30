import {Injectable} from '@angular/core';
import {XmppDataForm} from '../core/models/FormModels';
import {IqType, XmppService} from '../core/xmpp/xmpp.service';
import {JID} from 'xmpp-jid';
import {Affiliation, JidAffiliation} from '../core/models/Affiliation';

export enum LoadConfigurationFormErrorCodes {
  ItemNotFound = 'item-not-found',
  Unsupported = 'unsupported',
  Forbidden = 'forbidden',
  NotAllowed = 'not-allowed'
}

@Injectable()
export class TopicDetailsService {

  constructor(private xmppService: XmppService) {
  }

  public loadConfigurationForm(topicIdentifier: string): Promise<XmppDataForm> {
    return Promise.all([this.xmppService.getClient(), this.xmppService.pubSubJid])
      .then(([client, pubSubJid]) => this._loadFormFromClient(client, pubSubJid, topicIdentifier));
  }

  public updateTopicConfiguration(topicIdentifier: string, xmppDataForm: XmppDataForm): Promise<XmppDataForm> {
    return Promise.all([this.xmppService.getClient(), this.xmppService.pubSubJid])
      .then(([client, pubSubJid]) => this._submitForm(client, pubSubJid, topicIdentifier, xmppDataForm))
      .then(() => this.loadConfigurationForm(topicIdentifier));
  }

  /**
   * Loads all jid affiliations of the given node.
   */
  public loadJidAffiliations(node: string): Promise<JidAffiliation[]> {
    // TODO: WRITE TEST!
    const cmd = {
      type: IqType.Get,
      pubsubOwner: {
        affiliations: {
          node: node
        }
      }
    };
    return this.xmppService.executeIqToPubsub(cmd).then((response) => {
      const jidAffiliations = response.pubsubOwner.affiliations.list
        .map((entry) => new JidAffiliation(entry.jid.full, entry.type));
      return jidAffiliations;
    });
  }

  /**
   * Updates/Adds/Deletes the given affiliation on the given node.
   *
   * If the affiliation is none, the affiliation will be removed (according to xep-0060).
   */
  public modifyJidAffiliation(node: string, affiliation: JidAffiliation): Promise<void> {
    // TODO: WRITE TEST!
    const cmd = {
      type: IqType.Set,
      pubsubOwner: {
        affiliations: {
          node: node,
          affiliation: {
            jid: affiliation.jid,
            type: affiliation.affiliation
          }
        }
      }
    };
    return this.xmppService.executeIqToPubsub(cmd);
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
