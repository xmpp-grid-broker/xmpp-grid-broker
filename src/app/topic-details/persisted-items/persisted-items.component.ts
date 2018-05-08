import {Component, OnInit} from '@angular/core';
import {PersistedItem, PersistedItemsService} from '../persisted-items.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'xgb-persisted-items',
  templateUrl: './persisted-items.component.html',
  styleUrls: ['./persisted-items.component.css']
})
export class PersistedItemsComponent implements OnInit {

  persistedItems: PersistedItem[];

  private nodeId: string;

  constructor(private route: ActivatedRoute,
              private service: PersistedItemsService) {
  }

  ngOnInit() {
    this.nodeId = this.route.parent.snapshot.params.id;
    this.insertItemAndReturnPaged().then((items) => {
      this.persistedItems = items;
      console.log('done, got:');
      console.log(items);
    }).catch((err) => {
      console.log('got error');
      console.log(err);
    });
  }

  private async insertItemAndReturnPaged(): Promise<PersistedItem[]> {
    await this.service.insertPersistedItems(this.nodeId);
    const iterator = this.service.persistedItems(this.nodeId, null);
    const result: PersistedItem[] = [];
    for await (const x of iterator) {
      result.push(x);
    }
    return result;
  }
}
