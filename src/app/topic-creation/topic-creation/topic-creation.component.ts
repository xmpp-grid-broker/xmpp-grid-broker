import {Component, OnInit} from '@angular/core';
import {TopicCreationErrors, TopicCreationService} from '../topic-creation.service';
import {NavigationService} from '../../core';
import {XmppDataForm, XmppDataFormField, XmppDataFormFieldType} from '../../core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {FormProcessingStatus} from '../../shared';
import {TopicConfigComponent} from '../../topic-widgets';

@Component({
  selector: 'xgb-topic-creation',
  templateUrl: './topic-creation.component.html'
})
export class TopicCreationComponent implements OnInit {

  formGroup: FormGroup;
  isNewCollection: boolean;

  /**
   * The formStatus is used as a helper
   * to render the spinner, error and info boxes.
   */
  formProcessing: FormProcessingStatus = new FormProcessingStatus();

  /**
   * The form containing the default config loaded from the server.
   * Can be undefined if not supported by the server.
   */
  defaultConfigForm: XmppDataForm;

  constructor(private creationService: TopicCreationService,
              private navigationService: NavigationService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.formProcessing.begin();
    this.creationService.loadDefaultConfig()
      .then((form) => {
        this.defaultConfigForm = this.removeNodeTypeFromForm(form);
        this.formProcessing.done();
      })
      .catch(() => {
        this.formProcessing.done();
      });
    this.isNewCollection = this.route.snapshot.data.type === 'collection';
    this.formGroup = new FormGroup({
      'nodeID': new FormControl(null)
    });
  }

  submit(configElement?: TopicConfigComponent, configData?: XmppDataForm) {
    if (configElement && !configData) {
      configData = configElement.createFormToSubmit();
    }
    configData = this.addNodeTypeToForm(configData);
    this.formProcessing.begin();
    this.creationService.createTopic(this.formGroup.get('nodeID').value, configData)
      .then((topicIdentifier) =>
        this.navigationService.goToTopic(topicIdentifier)
      ).catch((error) => {
      this.formGroup.enable();
      switch (error.condition) {
        case TopicCreationErrors.FeatureNotImplemented:
          this.formProcessing.done({errorMessage: 'Service does not support node creation'});
          break;
        case TopicCreationErrors.RegistrationRequired:
          this.formProcessing.done({errorMessage: 'Service requires registration'});
          break;
        case TopicCreationErrors.Forbidden:
          this.formProcessing.done({errorMessage: 'Requesting entity is prohibited from creating nodes'});
          break;
        case TopicCreationErrors.Conflict:
          this.formProcessing.done({errorMessage: 'A topic with the given identifier does already exist'});
          break;
        case TopicCreationErrors.NodeIdRequired:
          this.formProcessing.done({errorMessage: 'Service does not support instant nodes'});
          break;
        default:
          this.formProcessing.done({errorMessage: `Failed to create new topic: ${JSON.stringify(error)}`});
      }
    });
    return false;
  }

  private removeNodeTypeFromForm(form: XmppDataForm) {
    return new XmppDataForm(form.fields.filter((field: XmppDataFormField) =>
      field.name !== 'pubsub#node_type'
    ));
  }

  private addNodeTypeToForm(configData: XmppDataForm | undefined) {
    const nodeTypeField = new XmppDataFormField(
      XmppDataFormFieldType.listSingle,
      'pubsub#node_type',
      this.isNewCollection ? 'collection' : 'leaf');
    if (!configData) {
      return new XmppDataForm([nodeTypeField]);
    } else {
      const fields = configData.fields;
      fields.push(nodeTypeField);
      return new XmppDataForm(fields);
    }

  }
}
