import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PersistedItemsService, PublishItemErrors} from '../persisted-items.service';
import {NgForm} from '@angular/forms';
import {NavigationService} from '../../../core/navigation.service';

@Component({
  selector: 'xgb-new-persisted-item',
  templateUrl: './new-persisted-item.component.html',
  styleUrls: ['./new-persisted-item.component.css']
})
export class NewPersistedItemComponent implements OnInit {
  nodeId: string;
  errorMessage: string | undefined;

  constructor(private route: ActivatedRoute,
              private persistedItemsService: PersistedItemsService,
              private navigationService: NavigationService) {
  }

  ngOnInit() {
    this.nodeId = this.route.snapshot.params.id;
    this.errorMessage = undefined;
  }

  submit(formRef: NgForm) {
    formRef.form.disable();
    const body = formRef.form.get('body').value;
    this.persistedItemsService.publishItem(this.nodeId, body)
      .then(() => this.navigationService.goToPersistedItems(this.nodeId))
      .catch((err) => {
        formRef.form.enable();
        if (err && err.condition) {
          switch (err.condition) {
            case PublishItemErrors.Forbidden:
              this.errorMessage = 'You have not sufficient privileges to publish to this node';
              return;
            case PublishItemErrors.FeatureNotImplemented:
              this.errorMessage = `Node ${this.nodeId} does not support item publication`;
              return;
            case PublishItemErrors.ItemNotFound:
              this.errorMessage = `Node ${this.nodeId} does not exist`;
              return;
            case PublishItemErrors.NotAcceptable:
              this.errorMessage = `Payload is too big`;
              return;
            case PublishItemErrors.BadRequest:
              this.errorMessage = `Bad Payload: The payload is not acceptable with the nodes configuration`;
              return;
          }
        }

        if (err && err.message === 'Incomplete document') {
          this.errorMessage = 'The given message is not a valid XML document';
          return;
        }
        this.errorMessage = `an unknown error occurred: ${JSON.stringify(err)}!`;
      });
  }
}
