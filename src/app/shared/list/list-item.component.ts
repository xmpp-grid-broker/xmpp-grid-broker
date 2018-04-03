import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'xgb-list-item',
  template: '<ng-content></ng-content>',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
