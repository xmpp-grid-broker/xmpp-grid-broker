import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PersistedItemsService} from '../persisted-items.service';
import {NgForm} from '@angular/forms';
import {ErrorToString, NavigationService} from '../../../core';

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
        this.errorMessage = ErrorToString(err);
      });
  }
}
