import {Component, OnInit} from '@angular/core';
import {CurrentTopicDetailService} from '../../current-topic-detail.service';
import {LoadPersistedItemsErrors, PersistedItemsService} from '../persisted-items.service';
import {IteratorListPager} from '../../../shared';
import {NotificationService} from '../../../core';
import {PersistedItem, Topic} from '../../../core';

@Component({
  selector: 'xgb-persisted-items',
  templateUrl: './persisted-items.component.html',
  styleUrls: ['./persisted-items.component.css']
})
export class PersistedItemsComponent implements OnInit {

  // Map used to keep track which items are "un-collapsed"
  toggleMap: { [key: number]: boolean; } = {};

  persistedItemsList = new IteratorListPager<PersistedItem>();

  topic: undefined | Topic;

  constructor(private detailsService: CurrentTopicDetailService,
              private service: PersistedItemsService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.topic = this.detailsService.currentTopic();
    this.persistedItemsList.useIterator(this.service.persistedItems(this.topic.title));
    this.persistedItemsList.useErrorMapper(PersistedItemsComponent.errorConditionToMessage);
  }

  async itemClicked(item: PersistedItem) {
    this.toggleMap[item.id] = !this.toggleMap[item.id];

    try {
      await this.service.loadPersistedItemContent(this.topic.title, item);
    } catch (err) {
      // Hide the code block and show an error
      this.toggleMap[item.id] = false;
      this.setError(err);
    }
  }

  async purgeItems() {
    const confirmation = await this.notificationService.confirm(
      'Warning',
      `You are about to permanently delete all persisted items from ${this.topic.title}! Are you sure to proceed?`,
      `Yes, permanently delete ALL items`, 'Cancel');
    if (!confirmation) {
      return;
    }
    await this.executeAndRefreshIterator(this.service.purgePersistedItem(this.topic.title));
  }


  async removeItem(item: PersistedItem) {

    const confirmation = await this.notificationService.confirm(
      'Warning',
      `You are about to permanently delete the item ${item.id} from the topic ${this.topic.title}! Are you sure to proceed?`,
      `Yes, permanently delete this item`, 'Cancel');
    if (!confirmation) {
      return;
    }

    await this.executeAndRefreshIterator(this.service.deletePersistedItem(this.topic.title, item));
  }

  private setError(err) {
    this.persistedItemsList.hasError = true;
    this.persistedItemsList.errorMessage = PersistedItemsComponent.errorConditionToMessage(err);
  }

  private async executeAndRefreshIterator(promise: Promise<void>) {
    try {
      await promise;
      this.persistedItemsList.useIterator(this.service.persistedItems(this.topic.title));
    } catch (err) {
      this.persistedItemsList.useIterator(this.service.persistedItems(this.topic.title))
        .then(() => this.setError(err))
        .catch(() => this.setError(err));
    }
  }

  private static errorConditionToMessage(error: any): string {
    switch (error.condition) {
      case LoadPersistedItemsErrors.FeatureNotImplemented:
        return 'The XMPP server does not support persisted items or persisted items retrieval';
      case LoadPersistedItemsErrors.NotAuthorized:
        return 'You are not authorized to fetch the persisted items. Check your subscription and the access model of this node';
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
