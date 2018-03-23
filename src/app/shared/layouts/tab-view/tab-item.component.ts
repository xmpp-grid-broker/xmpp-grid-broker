import {Component, Inject, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-tab-item',
  templateUrl: './tab-item.component.html'
})
export class TabItemComponent implements OnInit {
  @Input() isActive: boolean;
  @Input() routerLink: any[] | string;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {


  }

}
