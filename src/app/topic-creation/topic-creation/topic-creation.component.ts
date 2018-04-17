import {Component, OnInit} from '@angular/core';
import {XmppDataForm, XmppDataFormField} from '../../core/models/FormModels';
import {TopicCreationService} from '../topic-creation.service';
import {NavigationService} from '../../core/navigation.service';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'xgb-topic-creation',
  templateUrl: './topic-creation.component.html'
})
export class TopicCreationComponent implements OnInit {
  public xmppDataForm: XmppDataForm;
  public loading = true;
  public formGroup: FormGroup;

  constructor(private creationService: TopicCreationService,
              private navigationService: NavigationService) {
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({});

    this.creationService.loadForm().then((form) => {
      this.xmppDataForm = form;
      this.loading = false;
    });
  }

  submit(): void {
    const items = [];
    this.xmppDataForm.fields.forEach((field: XmppDataFormField) => {
        const newValue = this.formGroup.get(field.variable).value;
        if (newValue === field.value) {
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
    this.creationService.createTopic(new XmppDataForm(items)).then(() => {
      this.navigationService.goToHome();
    });
  }


}
