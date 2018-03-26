import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tab-item',
  templateUrl: './tab-item.component.html'
})
export class TabItemComponent implements OnInit {
  @Input() isActive: boolean;
  @Input() routerLink: any[] | string;

  ngOnInit() {


  }

}
