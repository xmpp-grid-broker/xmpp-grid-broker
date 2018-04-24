import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {XmppDataForm, XmppDataFormField} from '../core/models/FormModels';
import {LoadFormErrorCodes, TopicDetailsService} from './topic-details.service';
import {FormProcessingStatus} from '../shared/FormProcessingStatus';

@Component({
  selector: 'xgb-topic-details',
  templateUrl: './topic-details.component.html'
})
export class TopicDetailsComponent implements OnInit {
  /**
   * The NodeID as given via URL used to identify
   * the node (See XEP-0060 for details).
   */
  nodeId: string;

  /**
   * The xmpp data for as loaded from the server.
   */
  xmppDataForm: XmppDataForm;

  /**
   * A subset of the xmppDataForm that contains
   * all fields, for which no specific widgets
   * have been specified.
   */
  advancedConfigForm: XmppDataForm;
  /**
   * Fields, for which a specialized widget / validation takes place.

   */
  specificFormFields: string[] = ['pubsub#title'];

  /**
   * The Angular Form group used for form
   * binding (and eventually validation)
   * containing all fields of the
   * xmppDataForm. Form Binding is
   * managed by this
   */
  formGroup: FormGroup;

  /**
   * The formStatus is used as a helper
   * to render the spinner, error and info boxes.
   */
  formStatus: FormProcessingStatus = new FormProcessingStatus(true);

  constructor(private route: ActivatedRoute,
              private topicDetailsService: TopicDetailsService) {
  }

  ngOnInit(): void {
    this.nodeId = this.route.snapshot.params.id;

    this.topicDetailsService.loadForm(this.nodeId)
      .then((form: XmppDataForm) => {
        this.installForm(form);
        this.formStatus.done();
      })
      .catch((error) => {
        switch (error.condition) {
          case  LoadFormErrorCodes.ItemNotFound:
            this.formStatus.done({errorMessage: `Node with NodeID ${this.nodeId} does not exist!`});
            break;
          case  LoadFormErrorCodes.Unsupported:
            this.formStatus.done({errorMessage: `Node configuration is not supported by the XMPP server`});
            break;
          case  LoadFormErrorCodes.Forbidden:
            this.formStatus.done({errorMessage: `Insufficient Privileges to configure node ${this.nodeId}`});
            break;
          case  LoadFormErrorCodes.NotAllowed:
            this.formStatus.done({errorMessage: `There are no configuration options available`});
            break;
          default:
            this.formStatus.done({errorMessage: `An unknown error occurred: ${error.condition}!`, error});
        }
      });
  }

  submit(): void {
    this.formStatus.begin();

    this.topicDetailsService.updateTopic(this.nodeId, this.createFormToSubmit())
      .then((dataForm) => {
        this.installForm(dataForm);
        this.formStatus.done({
          successMessage: 'Form successfully updated!'
        });
      })
      .catch((error) => {
        this.formStatus.done({
          errorMessage: `Failed to update the configuration (Server responded with: ${error.condition})`,
          error
        });
      });
  }


  private createFormToSubmit(): XmppDataForm {
    const fields = [];

    this.xmppDataForm.fields.forEach((field: XmppDataFormField) => {
        const newValue = this.formGroup.get(field.name).value;
        if (field.name !== 'FORM_TYPE' && newValue === field.value) {
          return;
        }
        fields.push(field.cloneWithNewValue(newValue));
      }
    );

    return new XmppDataForm(fields);
  }

  private installForm(form: XmppDataForm) {
    this.xmppDataForm = form;
    this.formGroup = new FormGroup({});
    this.installSpecificForm();
    this.installAdvancedConfigForm();
  }

  private installSpecificForm() {
    this.xmppDataForm.fields.forEach((field) => {
      if (this.isSpecificFormField(field.name)) {
        this.formGroup.addControl(field.name, new FormControl(field.value));
        // TODO:
        // this.specificFormFields['pubsub#node_type'] = new FormControl(this.route.snapshot.data.type);
        // this.specificFormFields['pubsub#children'] = new FormControl(null);
        // this.specificFormFields['pubsub#collection'] = new FormControl(null);
      }
    });
  }

  private installAdvancedConfigForm() {
    const fields = this.xmppDataForm.fields.filter((field: XmppDataFormField) =>
      !this.isSpecificFormField(field.name)
    );
    this.advancedConfigForm = new XmppDataForm(fields);
  }

  private isSpecificFormField(fieldName: string): boolean {
    return this.specificFormFields.indexOf(fieldName) >= 0;
  }
}
