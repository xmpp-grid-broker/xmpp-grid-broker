import {Component, OnInit} from '@angular/core';
import {XmppDataForm, XmppDataFormFieldType, XmppDataValueFormField} from '../../core/models/FormModels';

@Component({
  selector: 'xgb-topic-creation',
  templateUrl: './topic-creation.component.html'
})
export class TopicCreationComponent {
  public form: XmppDataForm;

  constructor() {
    this.form = new XmppDataForm([
      new XmppDataValueFormField(
        XmppDataFormFieldType.hidden,
        'FORM_TYPE',
        'http://jabber.org/protocol/pubsub#node_config'
      ),
      new XmppDataValueFormField(
        XmppDataFormFieldType.textMulti,
        'pubsub#children',
        '',
        'The child nodes (leaf or collection) associated with a collection'
      ),
      new XmppDataValueFormField(
        XmppDataFormFieldType.textSingle,
        'pubsub#title',
        'Princely Musings (Atom)',
        'A friendly name for the node'
      ),
      new XmppDataValueFormField(
        XmppDataFormFieldType.boolean,
        'pubsub#deliver_notifications',
        'true',
        'Whether to deliver payloads with event notifications'
      ),
    ]);

  }

}
