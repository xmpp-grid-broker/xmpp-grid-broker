import {Injectable} from '@angular/core';
import {IqType, XmppService} from '../core/xmpp/xmpp.service';
import {Topic} from '../core/models/topic';
import {JxtErrorToXmppError, XmppErrorCondition} from '../core/errors';

/**
 * This service is used to pass topics
 * from the topic details tab view to it's children.
 *
 * All children can consume the `currentTopic` promise.
 *
 * Child components won't be rendered if the loading
 * has failed.
 */
@Injectable()
export class CurrentTopicDetailService {

  constructor(private xmppService: XmppService) {
  }

  private _topic: Topic;

  /**
   * This method can be used from the tabs
   * of the topic details tab view ot get the currently
   * rendered topic. Because they are only rendered
   * when the topic is successfully loaded, this
   * will always return a valid topic.
   */
  public currentTopic(): Topic {
    return this._topic;
  }

  /**
   * Loads the topic with the given identifier.
   * Returns a promise to handle possible failures.
   */
  public loadTopic(topicIdentifier: string): Promise<Topic> {
    const cmd = {
      type: IqType.Get,
      discoInfo: {
        node: topicIdentifier
      }
    };
    return this.xmppService.executeIqToPubsub(cmd)
      .then((response) => {
        this._topic = Topic.fromDiscoInfo(response.discoInfo);
        return this._topic;
      })
      .catch((err) => {
        throw JxtErrorToXmppError(err, {
          [XmppErrorCondition.ItemNotFound]: `Topic ${topicIdentifier} does not exist`
        });
      });
  }
}
