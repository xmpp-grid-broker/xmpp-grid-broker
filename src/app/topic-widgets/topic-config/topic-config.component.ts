import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {XmppDataForm, XmppDataFormField} from '../../core/models/FormModels';
import {FormProcessingStatus} from '../../shared/FormProcessingStatus';

@Component({
  selector: 'xgb-topic-config',
  templateUrl: './topic-config.component.html'
})
export class TopicConfigComponent {
  /**
   * The NodeID as given via URL used to identify
   * the node (See XEP-0060 for details).
   */
  @Input() public nodeId: string;

  /**
   * The label of the submit button.
   */
  @Input() public submitLabel: string;
  /**
   * The xmpp data for as loaded from the server.
   */
  @Input()
  public set xmppDataForm(form: XmppDataForm) {
    this.installForm(form);
  }

  /**
   * Event to bind to when the form is submitted.
   * The changed fields will be passed in the
   * form of an {XmppDataForm}.
   */
  @Output() public configSubmitted = new EventEmitter<XmppDataForm>();

  private _xmppDataForm: XmppDataForm;
  /**
   * A subset of the xmppDataForm that contains
   * all fields, for which no specific widgets
   * have been specified.
   */
  protected advancedConfigForm: XmppDataForm;

  /**
   * Fields, for which a specialized widget / validation takes place.
   */
  protected specificFormFields: string[] = ['pubsub#title'];

  /**
   * The Angular Form group used for form
   * binding (and eventually validation)
   * containing all fields of the
   * xmppDataForm. Form Binding is
   * managed by this
   */
  protected formGroup: FormGroup;

  constructor() {
  }

  protected onFormSubmit(): void {
    this.configSubmitted.emit(this.createFormToSubmit());
  }


  public installForm(form: XmppDataForm) {
    if (!form) {
      this._xmppDataForm = null;
      this.formGroup = null;

      return;
    }

    this._xmppDataForm = form;
    this.formGroup = new FormGroup({});
    this.installSpecificForm();
    this.installAdvancedConfigForm();

  }

  public createFormToSubmit(): XmppDataForm {
    if (!this._xmppDataForm) {
      return null;
    }
    const fields = [];

    this._xmppDataForm.fields.forEach((field: XmppDataFormField) => {
        const newValue = this.formGroup.get(field.name).value;
        if (field.name !== 'FORM_TYPE' && newValue === field.value) {
          return;
        }
        fields.push(field.cloneWithNewValue(newValue));
      }
    );

    return new XmppDataForm(fields);
  }


  private installSpecificForm() {
    this._xmppDataForm.fields.forEach((field) => {
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
    const fields = this._xmppDataForm.fields.filter((field: XmppDataFormField) =>
      !this.isSpecificFormField(field.name)
    );
    this.advancedConfigForm = new XmppDataForm(fields);
  }

  private isSpecificFormField(fieldName: string): boolean {
    return this.specificFormFields.indexOf(fieldName) >= 0;
  }
}
