import {Component, ContentChildren, QueryList} from '@angular/core';
import {TabComponent} from './tab.component';

@Component({
  selector: 'xgb-tabs',
  template: `
    <ul class="tab tab-block">
      <li *ngFor="let tab of tabs" class="tab-item">
        <a [routerLink]="tab.routerLink" routerLinkActive="active">{{tab.tabTitle}}</a>
      </li>
    </ul>
  `
})
export class TabsComponent  {

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

}
