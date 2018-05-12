import {Component, OnInit} from '@angular/core';
import {LoadPersistedItemsErrors, PersistedItem, PersistedItemsService} from '../persisted-items.service';
import {ActivatedRoute} from '@angular/router';
import {IteratorListPager} from '../../shared/list/iterator-list-pager';

@Component({
  selector: 'xgb-persisted-items',
  templateUrl: './persisted-items.component.html',
  styleUrls: ['./persisted-items.component.css']
})
export class PersistedItemsComponent implements OnInit {

  // Map used to keep track which items are "uncollapsed"
  toggleMap = {};

  persistedItemsList = new IteratorListPager<PersistedItem>();

  private nodeId: string;

  constructor(private route: ActivatedRoute,
              private service: PersistedItemsService) {
  }

  ngOnInit() {
    this.nodeId = this.route.parent.snapshot.params.id;
    this.persistedItemsList.useIterator(this.service.persistedItems(this.nodeId));
    this.persistedItemsList.useErrorMapper(PersistedItemsComponent.errorConditionToMessage);
  }

  itemClicked(item) {
    this.toggleMap[item.id] = !this.toggleMap[item.id];
    this.service.loadPersistedItemContent(this.nodeId, item)
      .catch((err) => {
        // Hide the code block and show an error
        this.toggleMap[item.id] = false;
        this.persistedItemsList.hasError = true;
        this.persistedItemsList.errorMessage = PersistedItemsComponent.errorConditionToMessage(err);
      });
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
