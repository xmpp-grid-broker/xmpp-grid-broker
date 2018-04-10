import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {XmppDataForm, XmppDataFormFieldType, XmppDataValueFormField} from '../FormModels';

@Component({
  selector: 'xgb-topic-config',
  templateUrl: './topic-config.component.html',
  styleUrls: ['./topic-config.component.css']
})
export class TopicConfigComponent implements OnInit {
  @Input() public form: XmppDataForm;
  public readonly fieldType = XmppDataFormFieldType;

  public configForm: FormGroup;

  ngOnInit() {
    // this.form = new XmppDataForm([
    //   new XmppDataValueFormField(
    //     XmppDataFormFieldType.hidden,
    //     'FORM_TYPE',
    //     'http://jabber.org/protocol/pubsub#node_config'
    //   ),
    //   new XmppDataValueFormField(
    //     XmppDataFormFieldType.textSingle,
    //     'pubsub#title',
    //     'Princely Musings (Atom)',
    //     'A friendly name for the node'
    //   ),
    //   new XmppDataValueFormField(
    //     XmppDataFormFieldType.boolean,
    //     'pubsub#deliver_notifications',
    //     'true',
    //     'Whether to deliver payloads with event notifications'
    //   ),
    // ]);

    // TODO: can the filed change?! What if async?

    const controls: { [fieldName: string]: FormControl } = {};

    this.form.fields.forEach((field: XmppDataValueFormField) => {
      // TODO: Add validators etc. here...
      controls[field.variable] = new FormControl(field.value);
    });

    this.configForm = new FormGroup(controls);
  }
}
