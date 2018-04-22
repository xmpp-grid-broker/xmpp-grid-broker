import {Component, OnInit} from '@angular/core';
import {TopicCreationService} from '../topic-creation.service';
import {NavigationService} from '../../core/navigation.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
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
      'nodeID': new FormControl(null, Validators.required)
    });
  }

  submit() {
    if (!this.formGroup.valid) {
      return false;
    }

    this.formGroup.disable();
    this.creationService.createTopic(this.formGroup.get('nodeID').value)
      .then(() => {
        this.navigationService.goToHome();
      }).catch((err) => {
      this.formGroup.enable();
      switch (err.error.code) {
        case '409':
          this.error = 'A topic with the given identifier does already exist';
          break;
        default:
          this.error = `Failed to create new topic: ${err.error.code}: ${err.error.condition} ${err.error.type}`;
      }
    });
    return false;
  }

}
