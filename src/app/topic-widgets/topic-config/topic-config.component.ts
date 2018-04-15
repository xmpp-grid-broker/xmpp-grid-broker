import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {XmppDataForm, XmppDataFormField, XmppDataFormFieldType} from '../../core/models/FormModels';

@Component({
  selector: 'xgb-topic-config',
  templateUrl: './topic-config.component.html',
  styleUrls: ['./topic-config.component.css']
})
export class TopicConfigComponent implements OnInit {
  /**
   * The data form to render.
   * Must be available at `onInit`.
   */
  @Input() public form: XmppDataForm;
  /**
   * The label of the submit button, eg. `save configuration` or `create topic`
   */
  @Input() public submitLabel: string;

  /**
   * This event will be fired if the form is valid
   * and is submitted.
   *
   * The payload is a copy of the given `form` (@Input), that only
   * contains elements which value has changed.
   */
  @Output() public formSubmitted = new EventEmitter<XmppDataForm>();

  // This is a reference to be able to check types in the angular templates
  public readonly fieldType = XmppDataFormFieldType;

  public configForm: FormGroup;

  ngOnInit() {
    const controls: { [fieldName: string]: FormControl } = {};

    this.form.fields.forEach((field: XmppDataFormField) => {
      // TODO: Add validators here...
      const validators = [];
      controls[field.variable] = new FormControl(field.value, validators);
    });

    this.configForm = new FormGroup(controls);
  }

  submit() {
    // TODO: check validity

    const items = [];
    this.form.fields.forEach((field: XmppDataFormField) => {
        const newValue = this.configForm.get(field.variable).value;
        const oldValue = field.value;
        if (newValue === oldValue) {
          return;
        }
        items.push(new XmppDataFormField(
          field.type,
          field.variable,
          newValue,
          field.label,
          field.options
        ));
      }
    );

    const diffForm = new XmppDataForm(items);
    this.formSubmitted.emit(diffForm);
  }
}
