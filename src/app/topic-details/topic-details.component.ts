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
  protected nodeId: string;

  /**
   * The formStatus is used as a helper
   * to render the spinner, error and info boxes.
   */
  protected formProcessing: FormProcessingStatus = new FormProcessingStatus();

  /**
   * The form that is currently loaded.
   */
  protected loadedForm: XmppDataForm;

  constructor(private route: ActivatedRoute,
              private topicDetailsService: TopicDetailsService) {
  }

  ngOnInit(): void {
    this.nodeId = this.route.snapshot.params.id;
    this.formProcessing.begin();

    this.topicDetailsService.loadForm(this.nodeId)
      .then((form: XmppDataForm) => {
        this.loadedForm = form;
        this.formProcessing.done();
      })
      .catch((error) => {
        switch (error.condition) {
          case  LoadFormErrorCodes.ItemNotFound:
            this.formProcessing.done({errorMessage: `Node with NodeID ${this.nodeId} does not exist!`});
            break;
          case  LoadFormErrorCodes.Unsupported:
            this.formProcessing.done({errorMessage: `Node configuration is not supported by the XMPP server`});
            break;
          case  LoadFormErrorCodes.Forbidden:
            this.formProcessing.done({errorMessage: `Insufficient Privileges to configure node ${this.nodeId}`});
            break;
          case  LoadFormErrorCodes.NotAllowed:
            this.formProcessing.done({errorMessage: `There are no configuration options available`});
            break;
          default:
            this.formProcessing.done({errorMessage: `An unknown error occurred: ${error.condition}!`, error});
        }
      });
  }

  submit(submittedForm: XmppDataForm): void {
    this.formProcessing.begin();
    this.topicDetailsService.updateTopic(this.nodeId, submittedForm)
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
}
