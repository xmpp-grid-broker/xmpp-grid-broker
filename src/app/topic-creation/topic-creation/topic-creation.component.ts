import {Component, OnInit} from '@angular/core';
import {TopicCreationErrors, TopicCreationService} from '../topic-creation.service';
import {NavigationService} from '../../core/navigation.service';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'xgb-topic-creation',
  templateUrl: './topic-creation.component.html'
})
export class TopicCreationComponent implements OnInit {

  formGroup: FormGroup;
  error: string;
  isNewCollection: boolean;

  constructor(private creationService: TopicCreationService,
              private navigationService: NavigationService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.isNewCollection = this.route.snapshot.data.type === 'collection';
    this.formGroup = new FormGroup({
      'nodeID': new FormControl(null)
    });
  }

  submit() {
    this.formGroup.disable();
    this.creationService.createTopic(this.formGroup.get('nodeID').value)
      .then((topicIdentifier) =>
        this.navigationService.goToTopic(topicIdentifier)
      ).catch((error) => {
      this.formGroup.enable();
      switch (error.condition) {
        case TopicCreationErrors.FeatureNotImplemented:
          this.error = 'Service does not support node creation';
          break;
        case TopicCreationErrors.RegistrationRequired:
          this.error = 'Service requires registration';
          break;
        case TopicCreationErrors.Forbidden:
          this.error = 'Requesting entity is prohibited from creating nodes';
          break;
        case TopicCreationErrors.Conflict:
          this.error = 'A topic with the given identifier does already exist';
          break;
        case TopicCreationErrors.NodeIdRequired:
          this.error = 'Service does not support instant nodes';
          break;
        default:
          console.log(error);
          this.error = `Failed to create new topic: (${error.type}: ${error.condition})`;
      }
    });
    return false;
  }

}
