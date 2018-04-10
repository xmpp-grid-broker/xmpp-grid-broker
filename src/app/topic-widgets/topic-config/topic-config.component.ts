import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {XmppDataForm, XmppDataFormFieldType, XmppDataValueFormField} from '../../core/models/FormModels';

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
    // TODO: can the filed change?! What if async?

    const controls: { [fieldName: string]: FormControl } = {};

    this.form.fields.forEach((field: XmppDataValueFormField) => {
      // TODO: Add validators etc. here...
      controls[field.variable] = new FormControl(field.value);
    });

    this.configForm = new FormGroup(controls);
  }
}
