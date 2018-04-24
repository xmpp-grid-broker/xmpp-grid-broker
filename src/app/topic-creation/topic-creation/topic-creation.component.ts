import {Component, OnInit} from '@angular/core';
import {TopicCreationErrors, TopicCreationService} from '../topic-creation.service';
import {NavigationService} from '../../core/navigation.service';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {FormProcessingStatus} from '../../shared/FormProcessingStatus';
import {XmppDataForm} from '../../core/models/FormModels';
import {TopicConfigComponent} from '../../topic-widgets/topic-config/topic-config.component';

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
  protected formProcessing: FormProcessingStatus = new FormProcessingStatus();

  /**
   * The form containing the default config loaded from the server.
   * Can be undefined if not supported by the server.
   */
  protected defaultConfigForm: XmppDataForm;

  constructor(private creationService: TopicCreationService,
              private navigationService: NavigationService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.formProcessing.begin();
    this.creationService.loadDefaultConfig()
      .then((form) => {
        this.defaultConfigForm = form;
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
          console.log(error);
          this.formProcessing.done({errorMessage: `Failed to create new topic: (${error.type}: ${error.condition})`});
      }
    });
    return false;
  }

}
