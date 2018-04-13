import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {XmppDataForm, XmppDataFormField, XmppDataFormFieldType} from '../../core/models/FormModels';

@Component({
  selector: 'xgb-topic-config',
  templateUrl: './topic-config.component.html',
  styleUrls: ['./topic-config.component.css']
})
export class TopicConfigComponent implements OnInit {
  @Input() public form: XmppDataForm;
  @Input() public submitLabel: string;

  // This is a reference to be able to check types in the angular templates
  public readonly fieldType = XmppDataFormFieldType;

  public configForm: FormGroup;

  ngOnInit() {
    // TODO: lazy load form via service...
    const controls: { [fieldName: string]: FormControl } = {};

    this.form.fields.forEach((field: XmppDataFormField) => {
      // TODO: Add validators here...
      const validators = [];
      controls[field.variable] = new FormControl(field.value, validators);
    });

    this.configForm = new FormGroup(controls);
  }

  // TODO: IMPLEMENT SUBMIT

  submit() {
  //   // TODO: check validity
  //   const items = [];
  //   this.form.fields.forEach((field: XmppDataFormField) => {
  //       const newValue = this.configForm.get(field.variable).value;
  //       const oldValue = field.value;
  //       if (newValue === oldValue) {
  //         return;
  //       }
  //       items.push(new XmppDataFormField(
  //         field.type,
  //         field.variable,
  //         newValue,
  //         // THESE SHOULD NOT BE REQUIRED...?!
  //         field.label,
  //         field.options
  //       ));
  //     }
  //   );
  //
  //   // TODO: submit on service!
  //   const diffForm = new XmppDataForm(items);
  //   console.log(diffForm);
  }
}
