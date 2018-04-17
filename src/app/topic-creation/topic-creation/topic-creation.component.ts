import {Component, OnInit} from '@angular/core';
import {XmppDataForm} from '../../core/models/FormModels';
import {TopicCreationService} from '../topic-creation.service';
import {NavigationService} from '../../core/navigation.service';

@Component({
  selector: 'xgb-topic-creation',
  templateUrl: './topic-creation.component.html'
})
export class TopicCreationComponent implements OnInit {
  public form: XmppDataForm;
  public loading = true;

  constructor(private creationService: TopicCreationService,
              private navigationService: NavigationService) {
  }

  ngOnInit(): void {
    this.creationService.loadForm().then((form) => {
      this.form = form;
      this.loading = false;
    });
  }

  onSubmit(): void {
    this.navigationService.goToHome();
  }

}
