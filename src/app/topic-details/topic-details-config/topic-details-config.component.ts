import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {XmppDataForm} from '../../core/models/FormModels';
import {LoadConfigurationFormErrorCodes, TopicDeletionErrorCodes, TopicDetailsService} from '../topic-details.service';
import {FormProcessingStatus} from '../../shared/FormProcessingStatus';
import {NavigationService} from '../../core/navigation.service';
import {NotificationService} from '../../core/notifications/notification.service';

@Component({
  selector: 'xgb-topic-details-config',
  templateUrl: './topic-details-config.component.html'
})
export class TopicDetailsConfigComponent implements OnInit {
  /**
   * The NodeID as given via URL used to identify
   * the node (See XEP-0060 for details).
   */
  nodeId: string;

  /**
   * The formStatus is used as a helper
   * to render the spinner, error and info boxes.
   */
  formProcessing: FormProcessingStatus = new FormProcessingStatus();

  /**
   * The form that is currently loaded.
   */
  loadedForm: XmppDataForm;

  /**
   * A utility property that helps hide the update
   * button if the loading fails.
   * @type {boolean}
   */
  initialFormLoaded = false;

  constructor(private route: ActivatedRoute,
              private topicDetailsService: TopicDetailsService,
              private navigationService: NavigationService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.nodeId = this.route.parent.snapshot.params.id;
    this.formProcessing.begin();

    this.topicDetailsService.loadConfigurationForm(this.nodeId)
      .then((form: XmppDataForm) => {
        this.initialFormLoaded = true;
        this.loadedForm = form;
        this.formProcessing.done();
      })
      .catch((error) => {
        switch (error.condition) {
          case  LoadConfigurationFormErrorCodes.ItemNotFound:
            this.formProcessing.done({errorMessage: `Node with NodeID ${this.nodeId} does not exist!`});
            break;
          case  LoadConfigurationFormErrorCodes.Unsupported:
            this.formProcessing.done({errorMessage: `Node configuration is not supported by the XMPP server`});
            break;
          case  LoadConfigurationFormErrorCodes.Forbidden:
            this.formProcessing.done({errorMessage: `Insufficient Privileges to configure node ${this.nodeId}`});
            break;
          case  LoadConfigurationFormErrorCodes.NotAllowed:
            this.formProcessing.done({errorMessage: `There are no configuration options available`});
            break;
          default:
            this.formProcessing.done({errorMessage: `An unknown error occurred: ${error.condition}!`, error});
        }
      });
  }

  submit(submittedForm: XmppDataForm): void {
    this.formProcessing.begin();
    this.topicDetailsService.updateTopicConfiguration(this.nodeId, submittedForm)
      .then((dataForm) => {
        this.loadedForm = dataForm;
        this.formProcessing.done({
          successMessage: 'Form successfully updated!'
        });
      })
      .catch((error) => {
        this.formProcessing.done({
          errorMessage: `Failed to update the configuration (Server responded with: ${error.condition})`,
          error
        });
      });
  }

  deleteTopic(event) {

    this.notificationService.confirm(
      'Warning',
      `You are about to permanently delete the Topic ${this.nodeId}! Are you sure to proceed?`,
      `Yes, permanently delete ${this.nodeId}`, 'Cancel')
      .then((confirmed) => {
        if (confirmed) {
          this.doDeleteTopic();
        }
      });
    event.preventDefault();
  }

  private doDeleteTopic() {
    this.topicDetailsService.deleteTopic(this.nodeId)
      .then(() => {
        console.log(this.navigationService.goToHome);
        this.navigationService.goToHome();
      })
      .catch((error) => {
        switch (error.condition) {
          case  TopicDeletionErrorCodes.ItemNotFound:
            this.formProcessing.done({errorMessage: `Node with NodeID ${this.nodeId} does not exist!`});
            break;
          case  TopicDeletionErrorCodes.Forbidden:
            this.formProcessing.done({errorMessage: `Insufficient Privileges to delete node ${this.nodeId}`});
            break;
          case  TopicDeletionErrorCodes.NotAllowed:
            this.formProcessing.done({errorMessage: `You are not allowed to delete the root node ${this.nodeId}!`});
            break;
          default:
            this.formProcessing.done({errorMessage: `An unknown error occurred: ${error.condition}!`, error});
        }
      });
  }
}
