import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root-topics',
  templateUrl: './root-topics.component.html',
  styleUrls: ['./root-topics.component.css']
})
export class RootTopicsComponent implements OnInit {

  isLoaded = false;
  nodes: [{ title: string }] = [{title: 'Node #1'}, {title: 'Node #2'}, {title: 'Node #3'}];

  constructor() {
  }

  ngOnInit() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 800);
  }

}
