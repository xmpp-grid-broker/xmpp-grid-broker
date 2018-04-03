import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'xgb-list',
  template: '<ng-content></ng-content>',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
