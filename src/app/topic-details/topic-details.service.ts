import {Injectable} from '@angular/core';
import {XmppDataForm} from '../core/models/FormModels';
import {IqType, XmppService} from '../core/xmpp/xmpp.service';
import {JidAffiliation} from '../core/models/Affiliation';

export enum LoadConfigurationFormErrorCodes {
  ItemNotFound = 'item-not-found',
  Unsupported = 'unsupported',
  Forbidden = 'forbidden',
  NotAllowed = 'not-allowed'
}

export enum AffiliationManagementErrorCodes {
  ItemNotFound = 'item-not-found',
  Unsupported = 'unsupported',
  Forbidden = 'forbidden'
}


export enum TopicDeletionErrorCodes {
  Forbidden = 'forbidden',
  ItemNotFound = 'item-not-found',
  NotAllowed = 'not-allowed' // Deleting the Root Node, see XEP-0248
}

@Injectable()
export class TopicDetailsService {

  constructor(private xmppService: XmppService) {
  }

  public loadConfigurationForm(topicIdentifier: string): Promise<XmppDataForm> {
    const cmd = {
      type: IqType.Get,
      pubsubOwner: {
        config: {
          node: topicIdentifier,
        }
      }
    };

    return this.xmppService.executeIqToPubsub(cmd).then((result) =>
      XmppDataForm.fromJSON(result.pubsubOwner.config.form)
    );
  }

  public async updateTopicConfiguration(topicIdentifier: string, xmppDataForm: XmppDataForm): Promise<XmppDataForm> {
    const form = xmppDataForm.toJSON();

    const cmd = {
      type: IqType.Set,
      pubsubOwner: {
        config: {
          node: topicIdentifier,
          form: form
        }
      }
    };

    return this.xmppService.executeIqToPubsub(cmd)
      .then(() => this.loadConfigurationForm(topicIdentifier));
  }

  /**
   * Loads all jid affiliations of the given node.
   */
  public loadJidAffiliations(node: string): Promise<JidAffiliation[]> {
    const cmd = {
      type: IqType.Get,
      pubsubOwner: {
        affiliations: {
          node: node
        }
      }
    };
    return this.xmppService.executeIqToPubsub(cmd).then((response) => {
      return response.pubsubOwner.affiliations.list
        .map((entry) => new JidAffiliation(entry.jid.full, entry.type));
    });
  }

  /**
   * Updates/Adds/Deletes the given affiliation on the given node.
   *
   * If the affiliation is none, the affiliation will be removed (according to xep-0060).
   */
  public modifyJidAffiliation(node: string, affiliation: JidAffiliation): Promise<void> {
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


  /**
   * Deletes the topic with the given topicIdentifier.
   */
  public deleteTopic(topicIdentifier: string): Promise<void> {
    const cmd = {
      type: IqType.Set,
      pubsubOwner: {
        del: topicIdentifier
      }
    };
    return this.xmppService.executeIqToPubsub(cmd);
  }


}
