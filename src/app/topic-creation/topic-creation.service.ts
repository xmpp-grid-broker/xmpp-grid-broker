import {Injectable} from '@angular/core';
import {ListOption, XmppDataForm, XmppDataFormField, XmppDataFormFieldType} from '../core/models/FormModels';
import {LeafTopic, Topic} from '../core/models/topic';

@Injectable()
export class TopicCreationService {

  constructor() {
  }

  loadForm(): Promise<XmppDataForm> {
    const result = new XmppDataForm([
      new XmppDataFormField(
        XmppDataFormFieldType.hidden,
        'FORM_TYPE',
        'http://jabber.org/protocol/pubsub#node_config'
      ),
      new XmppDataFormField(
        XmppDataFormFieldType.textMulti,
        'pubsub#children',
        'child1\nchild2',
        'The child nodes (leaf or collection) associated with a collection'
      ),
      new XmppDataFormField(
        XmppDataFormFieldType.textSingle,
        'pubsub#title',
        'Princely Musings (Atom)',
        'A friendly name for the node'
      ),
      new XmppDataFormField(
        XmppDataFormFieldType.boolean,
        'pubsub#deliver_notifications',
        true,
        'Whether to deliver payloads with event notifications'
      ),
      new XmppDataFormField(
        XmppDataFormFieldType.listSingle,
        'pubsub#access_model',
        null,
        'Specify the subscriber model',
        [
          new ListOption('authorize', 'Subscription requests must be approved and only subscribers may retrieve items'),
          new ListOption('open', 'Anyone may subscribe and retrieve items'),
          new ListOption('presence', 'Anyone with a presence subscription of both or from may subscribe and retrieve items'),
          new ListOption('roster', 'Anyone in the specified roster group(s) may subscribe and retrieve items'),
          new ListOption('whitelist', 'Only those on a whitelist may subscribe and retrieve items'),
        ]
      ),
      new XmppDataFormField(
        XmppDataFormFieldType.listMulti,
        'pubsub#show-values',
        ['dnd', 'chat'],
        'The presence states for which an entity wants to receive notifications',
        [
          new ListOption('away', 'XMPP Show Value of Away'),
          new ListOption('chat', 'XMPP Show Value of Chat'),
          new ListOption('dnd', 'XMPP Show Value of DND (Do Not Disturb)'),
          new ListOption('online', 'Mere Availability in XMPP (No Show Value)'),
          new ListOption('xa', 'XMPP Show Value of XA (Extended Away)'),
        ],
      ),
      new XmppDataFormField(
        XmppDataFormFieldType.jidMulti,
        'pubsub#contact',
        ['eva@openfire', 'admin@openfire'],
        'The JIDs of those to contact with questions'
      )
    ]);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(result);
      }, 500);
    });
  }

  createTopic(form: XmppDataForm): Promise<Topic> {
    return Promise.resolve(new LeafTopic(null));
  }

}
