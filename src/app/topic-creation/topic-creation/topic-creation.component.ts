import {Component, OnInit} from '@angular/core';
import {XmppDataForm, XmppDataFormField} from '../../core/models/FormModels';
import {TopicCreationService} from '../topic-creation.service';
import {NavigationService} from '../../core/navigation.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'xgb-topic-creation',
  templateUrl: './topic-creation.component.html'
})
export class TopicCreationComponent implements OnInit {

  loading = true;
  formGroup: FormGroup;
  advancedConfigForm: XmppDataForm;

  private xmppDataForm: XmppDataForm;
  private readonly specificFormFields = {'pubsub#title': new FormControl(null, Validators.required)};

  constructor(private creationService: TopicCreationService,
              private navigationService: NavigationService) {
  }

  ngOnInit(): void {
    this.creationService.loadForm().then((form: XmppDataForm) => {
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
        const newValue = this.formGroup.get(field.variable).value;
        if (newValue === field.value) {
          return;
        }
        fields.push(new XmppDataFormField(
          field.type,
          field.variable,
          newValue,
          field.label,
          field.options
        ));
      }
    );
    this.creationService.createTopic(new XmppDataForm(fields)).then(() => {
      this.navigationService.goToHome();
    });
  }

  private filterForm(form: XmppDataForm): XmppDataForm {
    const specificFieldNames = Object.keys(this.specificFormFields);
    const allFormFieldNames = form.fields.map((field: XmppDataFormField) => {
      return field.variable;
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
        return specificFieldNames.indexOf(field.variable) < 0;
      })
    );
  }
}
