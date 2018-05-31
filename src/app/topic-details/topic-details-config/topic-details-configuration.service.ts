import {Injectable} from '@angular/core';
import {XmppService} from '../../core';
import {XmppDataForm, XmppIqType} from '../../core';

export enum LoadConfigurationFormErrorCodes {
  ItemNotFound = 'item-not-found',
  Unsupported = 'unsupported',
  Forbidden = 'forbidden',
  NotAllowed = 'not-allowed'
}


export enum TopicDeletionErrorCodes {
  Forbidden = 'forbidden',
  ItemNotFound = 'item-not-found',
  NotAllowed = 'not-allowed' // Deleting the Root Node, see XEP-0248
}

@Injectable()
export class TopicDetailsConfigurationService {

  constructor(private xmppService: XmppService) {
  }

  public loadConfigurationForm(topicIdentifier: string): Promise<XmppDataForm> {
    const cmd = {
      type: XmppIqType.Get,
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
      type: XmppIqType.Set,
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
   * Deletes the topic with the given topicIdentifier.
   */
  public deleteTopic(topicIdentifier: string): Promise<void> {
    const cmd = {
      type: XmppIqType.Set,
      pubsubOwner: {
        del: topicIdentifier
      }
    };
    return this.xmppService.executeIqToPubsub(cmd);
  }


}
