import {Component, OnInit} from '@angular/core';
import {XmppDataForm} from '../../core/models/FormModels';
import {LoadConfigurationFormErrorCodes, TopicDeletionErrorCodes, TopicDetailsService} from '../topic-details.service';
import {FormProcessingStatus} from '../../shared/FormProcessingStatus';
import {NavigationService} from '../../core/navigation.service';
import {NotificationService} from '../../core/notifications/notification.service';
import {Topic} from '../../core/models/topic';
import {CurrentTopicDetailService} from '../current-topic-detail.service';

@Component({
  selector: 'xgb-topic-details-config',
  templateUrl: './topic-details-config.component.html'
})
export class TopicDetailsConfigComponent implements OnInit {
  /**
   * The topic on which to operate.
   */
  topic: undefined | Topic;

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

  constructor(private topicDetailsService: TopicDetailsService,
              private detailsService: CurrentTopicDetailService,
              private navigationService: NavigationService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.formProcessing.begin();
    this.topic = this.detailsService.currentTopic();
    this.topicDetailsService.loadConfigurationForm(this.topic.title)
      .then((form: XmppDataForm) => {
        this.initialFormLoaded = true;
        this.loadedForm = form;
        this.formProcessing.done();
      })
      .catch((error) => {
        switch (error.condition) {
          case  LoadConfigurationFormErrorCodes.Unsupported:
            this.formProcessing.done({errorMessage: `Node configuration is not supported by the XMPP server`});
            break;
          case  LoadConfigurationFormErrorCodes.Forbidden:
            this.formProcessing.done({errorMessage: `Insufficient Privileges to configure node ${this.topic.title}`});
            break;
          case  LoadConfigurationFormErrorCodes.NotAllowed:
            this.formProcessing.done({errorMessage: `There are no configuration options available`});
            break;
          default:
            this.formProcessing.done({errorMessage: `An unknown error occurred: ${JSON.stringify(error)}!`});
        }
      });
  }

  submit(submittedForm: XmppDataForm): void {
    this.formProcessing.begin();
    this.topicDetailsService.updateTopicConfiguration(this.topic.title, submittedForm)
      .then((dataForm) => {
        this.loadedForm = dataForm;
        this.formProcessing.done({
          successMessage: 'Form successfully updated!'
        });
      })
      .catch((error) => {
        this.formProcessing.done({
          errorMessage: `Failed to update the configuration (Server responded with: ${JSON.stringify(error)})`
        });
      });
  }

  deleteTopic(event) {

    this.notificationService.confirm(
      'Warning',
      `You are about to permanently delete the Topic ${this.topic.title}! Are you sure to proceed?`,
      `Yes, permanently delete ${this.topic.title}`, 'Cancel')
      .then((confirmed) => {
        if (confirmed) {
          this.doDeleteTopic();
        }
      });
    event.preventDefault();
  }

  private doDeleteTopic() {
    this.topicDetailsService.deleteTopic(this.topic.title)
      .then(() => {
        this.navigationService.goToHome();
      })
      .catch((error) => {
        switch (error.condition) {
          case  TopicDeletionErrorCodes.ItemNotFound:
            this.formProcessing.done({errorMessage: `Node with NodeID ${this.topic.title} does not exist!`});
            break;
          case  TopicDeletionErrorCodes.Forbidden:
            this.formProcessing.done({errorMessage: `Insufficient Privileges to delete node ${this.topic.title}`});
            break;
          case  TopicDeletionErrorCodes.NotAllowed:
            this.formProcessing.done({errorMessage: `You are not allowed to delete the root node ${this.topic.title}!`});
            break;
          default:
            this.formProcessing.done({errorMessage: `An unknown error occurred: ${JSON.stringify(error)}!`});
        }
      });
  }
}
