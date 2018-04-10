import {Component, Input} from '@angular/core';

@Component({
  selector: 'xgb-tab',
  template: ``
})
export class TabComponent {
  @Input() tabTitle: string;
  @Input() routerLink: any[] | string;
}
