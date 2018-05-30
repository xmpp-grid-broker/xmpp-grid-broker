import {Injectable} from '@angular/core';
import {JidAffiliation, XmppIqType} from '../../models';
import {XmppService} from '../../core/xmpp';

export enum AffiliationManagementErrorCodes {
  ItemNotFound = 'item-not-found',
  Unsupported = 'unsupported',
  Forbidden = 'forbidden'
}
@Injectable()
export class TopicAffiliationsService {
  constructor(private xmppService: XmppService) {
  }

  /**
   * Loads all jid affiliations of the given node.
   */
  public loadJidAffiliations(node: string): Promise<JidAffiliation[]> {
    const cmd = {
      type: XmppIqType.Get,
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
      type: XmppIqType.Set,
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

}
