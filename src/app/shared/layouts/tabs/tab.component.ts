import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-tab',
  template: ``
})
export class TabComponent {
  @Input() tabTitle: string;
  @Input() routerLink: any[] | string;
}
