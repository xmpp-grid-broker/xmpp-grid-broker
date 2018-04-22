import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {XmppDataForm, XmppDataFormField} from '../core/models/FormModels';
import {TopicDetailsService} from './topic-details.service';

@Component({
  selector: 'xgb-topic-details',
  templateUrl: './topic-details.component.html'
})
export class TopicDetailsComponent implements OnInit {
  topicIdentifier: string;

  constructor(private route: ActivatedRoute,
              private topicDetailsService: TopicDetailsService) {
  }

  loading = true;
  formGroup: FormGroup;
  advancedConfigForm: XmppDataForm;

  private xmppDataForm: XmppDataForm;
  private readonly specificFormFields = {'pubsub#title': new FormControl(null, [])};


  ngOnInit(): void {
    this.topicIdentifier = this.route.snapshot.params.id;
// TODO:
    // this.specificFormFields['pubsub#node_type'] = new FormControl(this.route.snapshot.data.type);
    // this.specificFormFields['pubsub#children'] = new FormControl(null);
    // this.specificFormFields['pubsub#collection'] = new FormControl(null);
    this.topicDetailsService.loadForm(this.topicIdentifier).then((form: XmppDataForm) => {
      this.formGroup = new FormGroup(this.specificFormFields);
      this.advancedConfigForm = this.filterForm(form);
      this.xmppDataForm = form;
      this.loading = false;
    });
  }

  submit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    const fields = [];
    this.xmppDataForm.fields.forEach((field: XmppDataFormField) => {
        const newValue = this.formGroup.get(field.name).value;
        if (field.name !== 'FORM_TYPE' && newValue === field.value) {
          return;
        }
        fields.push(new XmppDataFormField(
          field.type,
          field.name,
          newValue,
          field.label,
          field.options
        ));
      }
    );
    this.topicDetailsService.updateTopic(this.topicIdentifier, new XmppDataForm(fields)).then(() => {
      // TODO: update form
    });
  }

  private filterForm(form: XmppDataForm): XmppDataForm {
    const specificFieldNames = Object.keys(this.specificFormFields);
    const allFormFieldNames = form.fields.map((field: XmppDataFormField) => {
      return field.name;
    });

    // ensure all specificFieldNames are present
    const allSpecificFieldsPresent = specificFieldNames.every((fieldName: string) => {
      return allFormFieldNames.indexOf(fieldName) >= 0;
    });
    if (!allSpecificFieldsPresent) {
      throw new Error('Missing specific form elements!');
    }

    return new XmppDataForm(
      form.fields.filter((field: XmppDataFormField) => {
        const isNotSpecific = specificFieldNames.indexOf(field.name) < 0;
        if (!isNotSpecific) {
          // As a side effect, set the value on the specific fields...
          const x: FormControl = this.specificFormFields[field.name];
          x.setValue(field.value);
        }
        return isNotSpecific;
      })
    );
  }
}
