import {Component, OnInit} from '@angular/core';
import {LoadPersistedItemsErrors, PersistedItem, PersistedItemsService} from '../persisted-items.service';
import {ActivatedRoute} from '@angular/router';
import {IteratorListPager} from '../../shared/list/iterator-list-pager';
import {NotificationService} from '../../core/notifications/notification.service';

@Component({
  selector: 'xgb-persisted-items',
  templateUrl: './persisted-items.component.html',
  styleUrls: ['./persisted-items.component.css']
})
export class PersistedItemsComponent implements OnInit {

  // Map used to keep track which items are "uncollapsed"
  toggleMap: { [ key: number ]: boolean; } = {};

  persistedItemsList = new IteratorListPager<PersistedItem>();

  private nodeId: string;

  constructor(private route: ActivatedRoute,
              private service: PersistedItemsService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.nodeId = this.route.parent.snapshot.params.id;
    this.persistedItemsList.useIterator(this.service.persistedItems(this.nodeId));
    this.persistedItemsList.useErrorMapper(PersistedItemsComponent.errorConditionToMessage);
  }

  async itemClicked(item: PersistedItem) {
    this.toggleMap[item.id] = !this.toggleMap[item.id];

    try {
      await this.service.loadPersistedItemContent(this.nodeId, item);
    } catch (err) {
      // Hide the code block and show an error
      this.toggleMap[item.id] = false;
      this.setError(err);
    }
  }

  async removeItem(item: PersistedItem) {

    const confirmation = await this.notificationService.confirm(
      'Warning',
      `You are about to permanently delete the item ${item.id} from the topic ${this.nodeId}! Are you sure to proceed?`,
      `Yes, permanently delete this item`, 'Cancel');
    if (!confirmation) {
      return;
    }
    try {
      await this.service.deletePersistedItem(this.nodeId, item);
      this.persistedItemsList.useIterator(this.service.persistedItems(this.nodeId));
    } catch (err) {
      this.persistedItemsList.useIterator(this.service.persistedItems(this.nodeId))
        .then(() => this.setError(err))
        .catch(() => this.setError(err));
    }
  }

  private setError(err) {
    this.persistedItemsList.hasError = true;
    this.persistedItemsList.errorMessage = PersistedItemsComponent.errorConditionToMessage(err);
  }

  private static errorConditionToMessage(error: any): string {
    switch (error.condition) {
      case LoadPersistedItemsErrors.FeatureNotImplemented:
        return 'The XMPP server does not support persisted items or persisted items retrieval';
      case LoadPersistedItemsErrors.NotAuthorized:
        return 'You are not authorized to fetch the persited items. Check your subscription and the access model of this node';
      case LoadPersistedItemsErrors.PaymentRequired:
        return 'Payment is required to retrieve items';
      case LoadPersistedItemsErrors.Forbidden:
        return 'You are blocked from retrieving persisted items';
      case LoadPersistedItemsErrors.ItemNotFound:
        return 'Node or one of it\'s associated persisted persisted item does not exist';
      default:
        return `An unknown error occurred: ${JSON.stringify(error)}!`;
    }
  }
}
